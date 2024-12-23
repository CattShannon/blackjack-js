
const iaBehavior = (() => {

    'use strict'

    const probabilities = [0.1, 0.25, 0.4, 0.15, 0.05, 0.05]// para numeros de 0 a 5
    //                      0    1     2    3     4     5

    const acummulativeDistribution = probabilities.reduce((acc, initial) => {
        const lastDistribution = acc[acc.length - 1] || 0;
        acc.push(lastDistribution + initial);

        return acc;
    }, []);

    const getIAWinningThreshold = () => {
        const random = Math.random();

        for (let i in acummulativeDistribution) {
            if (random < acummulativeDistribution[i]) {
                return i * 1;
            }
        }
    }

    return {
        getIAWinningThreshold
    };
})();