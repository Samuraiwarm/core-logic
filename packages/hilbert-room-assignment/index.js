"use strict";
/**
 * Function checkAvailabilityOfHotel
 * check whether or not the hostel has enough space for given number of guests `guests`
 * @param {Object[]} roomList List of rooms available
 * @param {string} roomList[].id ID of rooms
 * @param {number} roomList[].available Number of available beds in the room
 * @param {number} guests Number of guests to book
 * @returns {boolean} Is the number of available beds more than `guests`?
 */
exports.__esModule = true;
exports.checkAvailabilityOfHotel = function (_a) {
    var roomList = _a.roomList, guests = _a.guests;
    return roomList.reduce(function (acc, val) { return acc + val.available; }, 0) >= guests;
};
/**
 * Function roomAssignmentByPrice
 * get the top `query` room assignment configurations that minimizes the price in total
 * Note: no 2 configurations have the same rooms, to prevent redundant and boring results.
 * Example of redundancy:
 * => 1st rank (room1 * 5ppl & room2 * 3ppl)
 * => 2nd rank (room1 * 4ppl & room2 * 4ppl)
 * @param {Object[]} roomList List of rooms available
 * @param {string} roomList[].id ID of rooms
 * @param {number} roomList[].price Price of room
 * @param {number} roomList[].available Number of available beds in the room
 * @param {number} guests Number of guests to book
 * @param {number} query Number of configurations for top `query` lowest price
 * @returns {Object[]: {roomConfig: {id: string, guests: number, price: number}[], totalPrice: number}[]}
 * 		returns list of configurations `roomConfig` that includes the ID `id` and
 * 		the number of guests `guests` that will occupy in the room `id`, and
 * 		the price of each configurations
 * If `checkAvailabilityOfHotel` fails, this function throws an error "Not enough space."
 */
exports.roomAssignmentByPrice = function (_a) {
    var roomList = _a.roomList, guests = _a.guests, query = _a.query;
    if (!exports.checkAvailabilityOfHotel({
        roomList: roomList,
        guests: guests
    })) {
        throw Error('Not enough space.');
    }
    var result = [];
    var roomListSorted = roomList.concat().sort(function (a, b) { return a.price - b.price; });
    var pointerArray = [0, roomList.length];
    var subsetRoomList = [roomListSorted[0]];
    var currentBranchGuestCount = roomListSorted[0].available;
    var remainingGuests = guests - currentBranchGuestCount;
    // Depth First Search - traverse on the tree of possible pointerArrays
    while (result.length < query) {
        // if more guests and can continue to next neighbor branch
        if (remainingGuests > 0 && ((pointerArray[pointerArray.length - 1] - pointerArray[pointerArray.length - 2] !== 1))) {
            pointerArray.splice(pointerArray.length - 1, 0, pointerArray[pointerArray.length - 2] + 1);
        }
        else { // no more neighbor branch
            // end of branch because sufficient number of guests -> push to results
            if (remainingGuests <= 0) {
                var config = {
                    roomConfig: subsetRoomList.map(function (item) {
                        return {
                            id: item.id,
                            guests: item.available,
                            price: item.price
                        };
                    }).sort(function (a, b) { return b.guests - a.guests; }),
                    totalPrice: 0
                };
                // more space than guests, set to remaining guests
                config.roomConfig[config.roomConfig.length - 1].guests += remainingGuests;
                config.totalPrice = config.roomConfig.reduce(function (acc, val) { return acc + val.guests * val.price; }, 0);
                result.push(config);
            }
            // go to next branch
            var pointer = pointerArray.length - 1;
            for (pointer = pointerArray.length - 1; pointer > 0; pointer--) {
                if (pointerArray[pointer] - pointerArray[pointer - 1] === 1) {
                    continue;
                }
                else {
                    break;
                }
            }
            if (pointer === 0) { // cannot traverse anymore, return as is
                return result;
            }
            if (pointer === pointerArray.length - 1) { // still at leaf's parent branch [0,1,2,3,10] -> [0,1,2,4,10]
                pointerArray[pointer - 1]++;
            }
            else {
                // ex: [0,1,2,3,8,9,10] -> [0,1,2,4,10], pointerArrayRemovedBranch = [3,8,9], increment first index
                var pointerArrayRemovedBranch = pointerArray.splice(pointer - 1, pointerArray.length - pointer);
                pointerArray.splice(pointer - 1, 0, pointerArrayRemovedBranch[0] + 1);
            }
        }
        subsetRoomList = pointerArray.slice(0, pointerArray.length - 1).map(function (item) { return roomListSorted[item]; });
        currentBranchGuestCount = subsetRoomList.reduce(function (acc, val) { return acc + val.available; }, 0);
        remainingGuests = guests - currentBranchGuestCount;
    }
    return result;
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
 * @param {string} roomList[].id ID of rooms
 * @param {number} roomList[].price Price of room
 * @param {number} roomList[].available Number of available beds in the room
 * @param {number} guests Number of guests to book.
 * @param {number} query Number of configurations for top `query` lowest price
 * @returns {Object[]: {roomConfig: {id: string, guests: number, price: number}[], totalPrice: number}[]}
 * 		Returns list of configurations `roomConfig` that includes the ID `id` and
 * 		the number of guests `guests` that will occupy in the room `id`, and
 * 		the price of each configurations
 * If `checkAvailabilityOfHotel` fails, this function throws an error "Not enough space."
  */
exports.roomAssignmentByRoomOccupancy = function (_a) {
    var roomList = _a.roomList, guests = _a.guests, query = _a.query;
    if (!exports.checkAvailabilityOfHotel({
        roomList: roomList,
        guests: guests
    })) {
        throw Error('Not enough space.');
    }
    var resultOneRoom = [];
    var resultMultipleRooms = [];
    var roomListSorted = roomList.concat().sort(function (a, b) { return b.available - a.available; });
    var roomListSortedOneRoom = roomListSorted.filter(function (item) { return item.available >= guests; });
    // Suggest room configuration that can fit all guests
    if (roomListSortedOneRoom.length > 0) {
        resultOneRoom = roomListSortedOneRoom.reverse().map(function (item) {
            return {
                roomConfig: [
                    {
                        id: item.id,
                        guests: guests,
                        price: item.price
                    }
                ],
                totalPrice: item.price * guests
            };
        });
        // Bypass the algorithm for low number of guests/query
        if (resultOneRoom.length > query) {
            return resultOneRoom.slice(0, query);
        }
    }
    // Find minimum number of rooms needed for reservation
    var minimumRoomsNeeded = 0;
    var topRoomSelectedCount = 0;
    while (guests > topRoomSelectedCount) {
        topRoomSelectedCount += roomListSorted[minimumRoomsNeeded].available;
        minimumRoomsNeeded++;
    }
    // Ig nore the case of single room as it has already bee calculated
    minimumRoomsNeeded = minimumRoomsNeeded !== 1 ? minimumRoomsNeeded : 2;
    // Greedy algorithm to select top rooms with highest `available`
    // Generate all subsets of an array of given length minimumRoomsNeeded
    while (resultOneRoom.length + resultMultipleRooms.length < query && minimumRoomsNeeded <= roomListSorted.length) {
        var pointerArray = Array.apply(null, { length: minimumRoomsNeeded }).map(Number.call, Number);
        pointerArray.push(roomListSorted.length); // Boundary of array
        var isFillable = true;
        var pointerArrayPointer = 0;
        while (isFillable) {
            isFillable = false;
            // Insert subset configuration
            var subsetRoomList = pointerArray.slice(0, minimumRoomsNeeded).map(function (item) { return roomListSorted[item]; });
            var config = {
                roomConfig: subsetRoomList.map(function (item) {
                    return {
                        id: item.id,
                        guests: item.available,
                        price: item.price
                    };
                }).sort(function (a, b) { return b.guests - a.guests; }),
                totalPrice: 0
            };
            var overcount = config.roomConfig.reduce(function (acc, val) { return acc + val.guests; }, 0) - guests;
            if (overcount >= 0) {
                while (overcount > 0) {
                    // Maximizing the distribution metric by removing the overcount with high guests first
                    config.roomConfig[0].guests--;
                    overcount--;
                    config.roomConfig.sort(function (a, b) { return b.guests - a.guests; });
                }
                config.totalPrice = config.roomConfig.reduce(function (acc, val) { return acc + val.guests * val.price; }, 0);
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
                // Skip pointerArray that has `available` total strictly less than current pointerArray's `available`
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
        if (a.roomConfig.reduce(function (acc, val) { return acc * val.guests; }, 1)
            !== b.roomConfig.reduce(function (acc, val) { return acc * val.guests; }, 1)) {
            return b.roomConfig.reduce(function (acc, val) { return acc * val.guests; }, 1)
                - a.roomConfig.reduce(function (acc, val) { return acc * val.guests; }, 1);
        }
        return b.totalPrice - a.totalPrice;
    });
    return resultOneRoom.concat(resultMultipleRooms).slice(0, query);
};
// // // Example uses
// // console.log(
// // 	checkAvailabilityOfHotel(
// // 		{
// // 			roomList:[
// // 				{
// // 					id:'shiba',price:10,available:10
// // 				},
// // 				{
// // 					id:'shiba',price:10,available:10
// // 				},
// // 				{
// // 					id:'shiba',price:10,available:10
// // 				},
// // 				{
// // 					id:'shiba',price:10,available:10
// // 				}
// // 			],
// // 			guests:41
// // 		}
// // 	)
// // )
// // // returns false
// console.log(JSON.stringify(roomAssignmentByPrice(
// 	{
// 		roomList:[
// 			{
// 				id:'50',price:50,available:10
// 			},
// 			{
// 				id:'40',price:40,available:20
// 			},
// 			{
// 				id:'30',price:30,available:30
// 			},
// 			{
// 				id:'20',price:20,available:40
// 			}
// 		],
// 		guests:91,
// 		query:10}
// )))
// // // returns [{"roomConfig":[{"id":"shiba","guests":69}],"price":420},{"roomConfig":[{"id":"doge","guests":114514}],"price":1919}]
// // console.log(JSON.stringify(roomAssignmentByRoomOccupancy(
// // 	{
// // 		roomList:[
// // 			// {
// // 			// 	id:'27',price:10,available:27
// // 			// },
// // 			// {
// // 			// 	id:'28',price:10,available:28
// // 			// },
// // 			// {
// // 			// 	id:'29',price:10,available:29
// // 			// },
// // 			// {
// // 			// 	id:'47',price:10,available:40
// // 			// },
// // 			{
// // 				id:'48',price:20,available:48
// // 			},
// // 			{
// // 				id:'49',price:30,available:49
// // 			},
// // 			{
// // 				id:'50',price:40,available:50
// // 			}
// // 		],
// // 		guests:49,
// // 		query:30
// // 	}
// // )))
// // // returns [ { id: 'shiba', guests: 114514 } ]
