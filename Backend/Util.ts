// https://www.tutorialspoint.com/how-to-create-guid-uuid-in-javascript
export const createUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const createRoomId = () => {
    return 'xxxxxx'.replace(/[x]/g, function(c) {
        var r = Math.random() * 16 | 0;
        return r.toString(16);
    });
}

export const shuffle = (arr: any) => {
    let count = arr.length, rand: number, temp: any;
    while (count) {
        rand = Math.random() * count-- | 0;
        temp = arr[count];
        arr[count] = arr[rand];
        arr[rand] = temp;
    }
}