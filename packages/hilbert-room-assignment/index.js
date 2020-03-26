"use strict";
/**
 * Function checkAvailabilityOfHotel
 * check whether or not the hostel has enough space for given number of guests `guestCount`
 * @param {Object[]} roomList List of rooms available
 * @param {string} roomList[].roomID ID of rooms
 * @param {number} roomList[].availableCount Number of available beds in the room
 * @param {number} guestCount Number of guests to book
 * @returns {boolean} Is the number of available beds more than `guestCount`?
 */
exports.__esModule = true;
exports.checkAvailabilityOfHotel = function (_a) {
    var roomList = _a.roomList, guestCount = _a.guestCount;
    return roomList.reduce(function (acc, val) { return acc + val.availableCount; }, 0) >= guestCount;
};
/**
 * Function roomAssignmentByPrice
 * get the top `query` room assignment configurations that minimizes the price in total
 * Note: no 2 configurations have the same rooms, to prevent redundant and boring results.
 * Example of redundancy:
 * => 1st rank (room1 * 5ppl & room2 * 3ppl)
 * => 2nd rank (room1 * 4ppl & room2 * 4ppl)
 * @param {Object[]} roomList List of rooms available
 * @param {string} roomList[].roomID ID of rooms
 * @param {number} roomList[].price Price of room
 * @param {number} roomList[].availableCount Number of available beds in the room
 * @param {number} guestCount Number of guests to book
 * @param {number} query Number of configurations for top `query` lowest price
 * @returns {Object[]: {roomConfig: {roomID: string, guestCount: number, price: number}[], totalPrice: number}[]}
 * 		returns list of configurations `roomConfig` that includes the ID `roomID` and
 * 		the number of guests `guestCount` that will occupy in the room `roomID`, and
 * 		the price of each configurations
 * If `checkAvailabilityOfHotel` fails, this function throws an error "Not enough space."
 */
exports.roomAssignmentByPrice = function (_a) {
    var roomList = _a.roomList, guestCount = _a.guestCount, query = _a.query;
    if (!exports.checkAvailabilityOfHotel({
        roomList: roomList,
        guestCount: guestCount
    })) {
        throw Error('Not enough space.');
    }
    return [
        {
            roomConfig: [
                {
                    roomID: 'shiba',
                    guestCount: 69,
                    price: 6969
                }
            ],
            totalPrice: 4040404
        },
        {
            roomConfig: [
                {
                    roomID: 'doge',
                    guestCount: 114514,
                    price: 123
                }
            ],
            totalPrice: 123
        }
    ];
};
/**
 * Function roomAssignmentByRoomOccupancy
 * Get the top `query` room assignment configurations that has the minimum the number of rooms
 * that are used in the room assignment.
 *
 * If there are less than `query` items in the result, the function finds more configurations that
 * uses 1 room more than the original result.
 * Else, return top `query` items such that guests are distributed more evenly,
 * quantitatively defined by the product of the guests assigned in each room.
 * For example, [4, 4, 4] => 64 is more favorable than [3, 4, 5] => 60.
 *
 * If the number of rooms used is 1, sort ascendingly by the number of available beds,
 * then, sort ascendingly by the lowest number of rooms used,
 * and sort descendingly by how moredistributed the guests are.
 * Note: no 2 configurations have the same rooms, to prevent redundant and boring results.
 * Example of redundancy:
 * => 1st rank (room1 * 5ppl & room2 * 3ppl)
 * => 2nd rank (room1 * 4ppl & room2 * 4ppl)
 * @param {Object[]} roomList List of rooms available
 * @param {string} roomList[].roomID ID of rooms
 * @param {number} roomList[].price Price of room
 * @param {number} roomList[].availableCount Number of available beds in the room
 * @param {number} guestCount Number of guests to book.
 * @param {number} query Number of configurations for top `query` lowest price
 * @returns {Object[]: {roomConfig: {roomID: string, guestCount: number, price: number}[], totalPrice: number}[]}
 * 		Returns list of configurations `roomConfig` that includes the ID `roomID` and
 * 		the number of guests `guestCount` that will occupy in the room `roomID`, and
 * 		the price of each configurations
 * If `checkAvailabilityOfHotel` fails, this function throws an error "Not enough space."
  */
exports.roomAssignmentByRoomOccupancy = function (_a) {
    var roomList = _a.roomList, guestCount = _a.guestCount, query = _a.query;
    if (!exports.checkAvailabilityOfHotel({
        roomList: roomList,
        guestCount: guestCount
    })) {
        throw Error('Not enough space.');
    }
    var resultOneRoom = [];
    var resultMultipleRooms = [];
    var roomListSorted = roomList.concat().sort(function (a, b) { return b.availableCount - a.availableCount; });
    var roomListSortedOneRoom = roomListSorted.filter(function (item) { return item.availableCount >= guestCount; });
    // Suggest room configuration that can fit all guests
    if (roomListSortedOneRoom.length > 0) {
        resultOneRoom = roomListSortedOneRoom.reverse().map(function (item) {
            return {
                roomConfig: [
                    {
                        roomID: item.roomID,
                        guestCount: guestCount,
                        price: item.price
                    }
                ],
                totalPrice: item.price * guestCount
            };
        });
        // Bypass the algorithm for low number of guests/query
        if (resultOneRoom.length > query) {
            return resultOneRoom.slice(0, query);
        }
    }
    // Find minimum number of rooms needed for reservation
    // const roomListSortedSeveralRooms = roomListSorted.filter(item => item.availableCount < guestCount);
    // if (roomListSortedSeveralRooms.length === 0) {
    // 	return resultOneRoom.slice(0, query); // Not enough configurations that satisfy conditions
    // }
    var minimumRoomsNeeded = 0;
    var topRoomSelectedCount = 0;
    while (guestCount > topRoomSelectedCount) {
        console.log(minimumRoomsNeeded);
        topRoomSelectedCount += roomListSorted[minimumRoomsNeeded].availableCount;
        minimumRoomsNeeded++;
    }
    minimumRoomsNeeded = minimumRoomsNeeded !== 1 ? minimumRoomsNeeded : 2;
    // Greedy algorithm to select top rooms with highest availableCount
    // Generate all subsets of an array of given length minimumRoomsNeeded
    while (resultOneRoom.length + resultMultipleRooms.length < query && minimumRoomsNeeded <= roomListSorted.length) {
        var pointerArray = Array.apply(null, { length: minimumRoomsNeeded }).map(Number.call, Number); //asubset
        pointerArray.push(roomListSorted.length); // Boundary of array
        var isFillable = true; //r
        var pointerArrayPointer = 0; //start
        while (isFillable) {
            isFillable = false;
            // Insert subset configuration
            var subsetRoomList = pointerArray.slice(0, minimumRoomsNeeded).map(function (item) { return roomListSorted[item]; });
            var config = {
                roomConfig: subsetRoomList.map(function (item) {
                    return {
                        roomID: item.roomID,
                        guestCount: item.availableCount,
                        price: item.price
                    };
                }).sort(function (a, b) { return b.guestCount - a.guestCount; }),
                totalPrice: 0
            };
            var overcount = config.roomConfig.reduce(function (acc, val) { return acc + val.guestCount; }, 0) - guestCount;
            if (overcount >= 0) {
                while (overcount > 0) {
                    // Maximizing the distribution metric by removing the overcount with high guestCount first
                    config.roomConfig[0].guestCount--;
                    overcount--;
                    config.roomConfig.sort(function (a, b) { return b.guestCount - a.guestCount; });
                }
                config.totalPrice = config.roomConfig.reduce(function (acc, val) { return acc + val.guestCount * val.price; }, 0);
                resultMultipleRooms.push(config);
                // Increment index
                for (var index = pointerArrayPointer; index < minimumRoomsNeeded; index++) {
                    pointerArray[index]++;
                    if (pointerArray[index] < pointerArray[index + 1]) {
                        isFillable = true;
                        pointerArrayPointer = Math.max(0, index - 1); // Shift pointer to left if possible
                        break;
                    }
                    else {
                        pointerArray[index] = index;
                    }
                }
            }
            else {
                // Skip pointerArray that has availableCount total strictly less than current pointerArray's availableCount
                var i = void 0;
                for (i = pointerArray.length - 2; i > 0; i--) {
                    if (pointerArray[i] - pointerArray[i - 1] >= 2) {
                        pointerArray[i - 1]++;
                        for (var j = i; j <= pointerArray.length - 2; j++) {
                            pointerArray[j] = pointerArray[j - 1] + 1;
                        }
                        break; // break for loop
                    }
                }
                if (i === 0) {
                    // break while loop and continue with minimumRoomsNeeded
                    minimumRoomsNeeded++;
                    break;
                }
            }
        }
        minimumRoomsNeeded++;
    }
    resultMultipleRooms.sort(function (a, b) {
        if (a.roomConfig.length !== b.roomConfig.length) {
            return a.roomConfig.length - b.roomConfig.length;
        }
        // if (a.roomConfig.length === 1 && b.roomConfig.length === 1) {
        // 	return a.roomConfig[0].guestCount - b.roomConfig[0].guestCount;
        // }
        // if (a.roomConfig.length === 1) {
        // 	return 1;
        // }
        // if (b.roomConfig.length === 1) {
        // 	return -1;
        // }
        if (a.roomConfig.reduce(function (acc, val) { return acc * val.guestCount; }, 1)
            !== b.roomConfig.reduce(function (acc, val) { return acc * val.guestCount; }, 1)) {
            return b.roomConfig.reduce(function (acc, val) { return acc * val.guestCount; }, 1)
                - a.roomConfig.reduce(function (acc, val) { return acc * val.guestCount; }, 1);
        }
        return b.totalPrice - a.totalPrice;
    });
    return resultOneRoom.concat(resultMultipleRooms).slice(0, query);
    // return [
    // 	{
    // 		roomConfig: [
    // 			{
    // 				roomID: 'shiba',
    // 				guestCount: 114514,
    // 				price: 1231,
    // 			}
    // 		],
    // 		totalPrice: 1919
    // 	},
    // 	{
    // 		roomConfig: [
    // 			{
    // 				roomID: 'doge',
    // 				guestCount: 420,
    // 				price: 123,
    // 			},
    // 			{
    // 				roomID: 'uwu',
    // 				guestCount: 69,
    // 				price: 123,
    // 			}
    // 		],
    // 		totalPrice: 810
    // 	}
    // ];
};
// Example uses
console.log(exports.checkAvailabilityOfHotel({
    roomList: [
        {
            roomID: 'shiba', price: 10, availableCount: 10
        },
        {
            roomID: 'shiba', price: 10, availableCount: 10
        },
        {
            roomID: 'shiba', price: 10, availableCount: 10
        },
        {
            roomID: 'shiba', price: 10, availableCount: 10
        }
    ],
    guestCount: 41
}));
// returns false
// console.log(JSON.stringify(roomAssignmentByPrice(
// 	{
// 		roomList:[
// 			{
// 				roomID:'shiba',price:10,availableCount:10
// 			},
// 			{
// 				roomID:'shiba',price:20,availableCount:20
// 			},
// 			{
// 				roomID:'shiba',price:30,availableCount:30
// 			},
// 			{
// 				roomID:'shiba',price:40,availableCount:40
// 			}
// 		],
// 		guestCount:10,
// 		query:10}
// )))
// returns [{"roomConfig":[{"roomID":"shiba","guestCount":69}],"price":420},{"roomConfig":[{"roomID":"doge","guestCount":114514}],"price":1919}]
console.log(JSON.stringify(exports.roomAssignmentByRoomOccupancy({
    roomList: [
        // {
        // 	roomID:'27',price:10,availableCount:27
        // },
        // {
        // 	roomID:'28',price:10,availableCount:28
        // },
        // {
        // 	roomID:'29',price:10,availableCount:29
        // },
        // {
        // 	roomID:'47',price:10,availableCount:40
        // },
        {
            roomID: '48', price: 20, availableCount: 48
        },
        {
            roomID: '49', price: 30, availableCount: 49
        },
        {
            roomID: '50', price: 40, availableCount: 50
        }
    ],
    guestCount: 49,
    query: 30
})));
// returns [ { roomID: 'shiba', guestCount: 114514 } ]
