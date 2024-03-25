const data = require("./db/data/dev-data/coinsData")

function countDuplicateCoinIds(data) {
    const idCounts = {}; // Object to store each coin_id's count
    let duplicates = 0; // Counter for duplicates

    data.forEach(item => {
        if (idCounts[item.coin_id]) {
            // If the coin_id is already in the object, increment duplicates counter
            // only the first time it's recognized as a duplicate
            if (idCounts[item.coin_id] === 1) {
                duplicates++;
            }
            idCounts[item.coin_id]++;
        } else {
            // If the coin_id is not in the object, add it with a count of 1
            idCounts[item.coin_id] = 1;
        }
    });

    // If you need the total number of duplicate entries, not just the number of unique ids that are duplicated,
    // you can iterate over `idCounts` and add up counts where count > 1.
    return duplicates;
}

console.log(countDuplicateCoinIds(data)); // Output: 2
