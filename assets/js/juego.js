
/**
 * Reglas de negocio:
 * 
 * Todas las cartas que sean numeros valen lo que indique su numero, ej 2D vale 2, 4H vale 4, etc.
 * Todas las cartas que son letras excepto la A, valen 10 puntos
 * La carta A vale 11 puntos
 * 
 * Gana el jugador que consiga acercarse mas a los 21 puntos sin pasarse de esa cantidad
 */

(() => {
    'use strict'
    
    const SPECIAL_CARDS = {
        A: 11,
        J: 10,
        Q: 10,
        K: 10
    },
        WINNING_SCORE = 21;

    let playerScore,
        IAScore,
        currentlyInGame,
        deck,
        IAWinningThreshold;

    Object.freeze(SPECIAL_CARDS);

    //Referencias del HTML
    const btnNewGame = document.querySelector('#btn-new-game'),
          btnTakeCard = document.querySelector('#btn-take-card'),
          btnStopGame = document.querySelector('#btn-stop-game'),
          smallPlayerScore = document.querySelector('#small-player-score'),
          smallIAScore = document.querySelector('#small-ia-score'),
          divPlayerCards = document.querySelector('#div-player-cards'),
          divIACards = document.querySelector('#div-ia-cards');


    const fillWithCardTypes = (cardTypes, cardValue) => {
        for (let cartType of cardTypes) {
            deck.push(`${cardValue}${cartType}`);
        }
    }

    const createDeck = () => {
        let cardTypes = ['C', 'D', 'H', 'S'];

        deck = [];

        for (let i = 2; i <= 10; i++) {
            fillWithCardTypes(cardTypes, i)
        }

        for (let specialCard of Object.getOwnPropertyNames(SPECIAL_CARDS)) {
            fillWithCardTypes(cardTypes, specialCard)
        }

        deck = _.shuffle(deck);
    };

    const startNewGame = () => {

        divPlayerCards.innerHTML = '';
        divIACards.innerHTML = '';
        playerScore = 0;
        IAScore = 0;
        createDeck();
        currentlyInGame = true;
        smallPlayerScore.innerText = '0'
        smallIAScore.innerText = '0'
        IAWinningThreshold = iaBehavior.getIAWinningThreshold();
    };

    const takeACard = () => {

        if (deck.length === 0) {
            throw 'No hay más cartas en el deck';
        }

        let card = deck.pop();
        return card;
    };

    const cardValue = (card) => {
        const value = card.match(/(\d{1,2}|\w{1})(\w+)/i).at(1);

        return (isNaN(value)) ? SPECIAL_CARDS[value] : value * 1
    };


    const executeTurn = () => {
        const takenCard = takeACard();
        const turnScore = cardValue(takenCard);

        let newCardImageElement = document.createElement('img');
        newCardImageElement.classList.add('blackjack-card')
        newCardImageElement.src = `assets/cartas/${takenCard}.png`;

        return {
            turnScore,
            newCardImageElement
        }
    };

    const displayTurnResult = (divCards, smallScore, htmlNewCardImage, actualScore) => {
        divCards.append(htmlNewCardImage);
        smallScore.innerText = `${actualScore}`
    }


    const playIATurn = () => {

        const scoringGoal = WINNING_SCORE - IAWinningThreshold;
        let IAStillPlaying = true;
        let temporaryIAScore = 0;

        console.warn('Stating IA turn');

        do {

            let turnResult = executeTurn(IAScore);
            temporaryIAScore += turnResult.turnScore;

            if (temporaryIAScore <= scoringGoal) {

                IAScore = temporaryIAScore;
                displayTurnResult(divIACards, smallIAScore, turnResult.newCardImageElement, IAScore);

                if (IAScore === scoringGoal || IAScore === scoringGoal - 1) {
                    IAStillPlaying = false;
                }

                console.warn("La computadora está tomando otra carta.");
            } else {
                temporaryIAScore = IAScore;
            }
        } while (IAStillPlaying || deck.length < 1);

        console.warn('La computadora ha finalizado su turno.')
    };

    const checkWinner = () => {
        const finalPlayerScore = WINNING_SCORE - playerScore;
        const finalIAScore = WINNING_SCORE - IAScore;

        setTimeout(() => {
            (finalPlayerScore < 0 || finalIAScore < finalPlayerScore) ? alert('Computadora gana')
                : (finalPlayerScore === finalIAScore)
                    ? alert('Empate')
                    : alert('Has ganado');
        }, 1000);
    };

    const stopPlayerTurn = () => {
        currentlyInGame = false;
        playIATurn();
        checkWinner();
    };

    const checkPlayerTurn = (score) => (score >= WINNING_SCORE) ? stopPlayerTurn() : undefined;


    startNewGame();

    //Eventos
    btnNewGame.addEventListener('click', () => {
        (!currentlyInGame || confirm('Estás seguro que deseas iniciar un juego nuevo?'))
            && startNewGame();

        console.clear();
    })

    btnTakeCard.addEventListener('click', () => {

        if (!currentlyInGame) {
            alert('No hay una partida activa');
            return undefined;
        }

        let turnResult = executeTurn();
        playerScore += turnResult.turnScore;

        displayTurnResult(divPlayerCards, smallPlayerScore, turnResult.newCardImageElement, playerScore);

        checkPlayerTurn(playerScore);
    })// esta funcion del segundo argumento se conoce como callback

    btnStopGame.addEventListener('click', () => {

        (!currentlyInGame) ? alert('No hay una partida activa') : stopPlayerTurn();
    })
})();//Patron modulo, mas seguridad