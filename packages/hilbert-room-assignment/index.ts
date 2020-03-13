/**
 * Function checkAvailabilityOfHotel
 * check whether or not the hostel has enough space for given number of guests `guestCount`
 * @param {Object[]} roomList List of rooms available
 * @param {string} roomList[].roomID ID of rooms
 * @param {number} roomList[].availableCount Number of available beds in the room
 * @param {number} guestCount Number of guests to book
 * @returns {boolean} Is the number of available beds more than `guestCount`?
 */

export const checkAvailabilityOfHotel = ({
	roomList,
	guestCount,
}: {
	roomList: {
		roomID: string;
		price: number;
		availableCount: number;
	}[];
	guestCount: number;
}) : boolean => {
	return true;
}

/**
 * Function roomAssignmentByPrice
 * get the top `query` room assignment configurations that minimizes the price in total
 * @param {Object[]} roomList List of rooms available
 * @param {string} roomList[].roomID ID of rooms
 * @param {number} roomList[].price Price of room
 * @param {number} roomList[].availableCount Number of available beds in the room
 * @param {number} guestCount Number of guests to book
 * @param {number} query Number of configurations for top `query` lowest price
 * @returns {Object[]: {roomConfig: {roomID: string, guestCount: number}[], price: number}[]}
 * 		returns list of configurations `roomConfig` that includes the ID `roomID` and
 * 		the number of guests `guestCount` that will occupy in the room `roomID`, and
 * 		the price of each configurations
 */

export const roomAssignmentByPrice = ({
	roomList,
	guestCount,
	query,
}: {
	roomList: {
		roomID: string;
		price: number;
		availableCount: number;
	}[];
	guestCount: number;
	query: number;
}) : {
	roomConfig: {
		roomID: string,
		guestCount: number;
	}[],
	price: number
}[] => {
	if (checkAvailabilityOfHotel({
		roomList: roomList,
		guestCount: guestCount
	})) {
		return [
			{
				roomConfig: [
					{
						roomID: 'shiba',
						guestCount: 69
					}
				],
				price: 420
			},
			{
				roomConfig: [
					{
						roomID: 'doge',
						guestCount: 114514
					}
				],
				price: 1919
			}
		];
	}
	throw Error('Not enough space.')
}

/**
 * Function roomAssignmentByRoomOccupancy
 * get the top `query` room assignment configurations that minimizes the number of rooms
 * that are used in the room assignment
 * @param {Object[]} roomList List of rooms available
 * @param {string} roomList[].roomID ID of rooms
 * @param {number} roomList[].price Price of room
 * @param {number} roomList[].availableCount Number of available beds in the room
 * @param {number} guestCount Number of guests to book
 * @param {number} query Number of configurations for top `query` lowest price
 * @returns {Object[]: {roomConfig: {roomID: string, guestCount: number}[], price: number}[]}
 * 		returns list of configurations `roomConfig` that includes the ID `roomID` and
 * 		the number of guests `guestCount` that will occupy in the room `roomID`, and
 * 		the price of each configurations
 */

export const roomAssignmentByRoomOccupancy = ({
	roomList,
	guestCount,
	query,
}: {
	roomList: {
		roomID: string;
		price: number;
		availableCount: number;
	}[];
	guestCount: number;
	query: number;
}) : {
	roomConfig: {
		roomID: string,
		guestCount: number;
	}[],
	price: number
}[] => {
	if (checkAvailabilityOfHotel({
		roomList: roomList,
		guestCount: guestCount
	})) {
		return [
			{
				roomConfig: [
					{
						roomID: 'shiba',
						guestCount: 114514
					}
				],
				price: 1919
			},
			{
				roomConfig: [
					{
						roomID: 'doge',
						guestCount: 420
					},
					{
						roomID: 'uwu',
						guestCount: 69
					}
				],
				price: 810
			}
		];
	}
	throw Error('Not enough space.')
}

// Example uses

console.log(JSON.stringify(roomAssignmentByPrice(
	{roomList:[{roomID:'shiba',price:10,availableCount:10}],guestCount:10,query:10}
)))
// returns [{"roomConfig":[{"roomID":"shiba","guestCount":69}],"price":420},{"roomConfig":[{"roomID":"doge","guestCount":114514}],"price":1919}]

console.log(roomAssignmentByRoomOccupancy(
	{roomList:[{roomID:'shiba',price:10,availableCount:10}],guestCount:10,query:10}
)[0].roomConfig)
// returns [ { roomID: 'shiba', guestCount: 114514 } ]