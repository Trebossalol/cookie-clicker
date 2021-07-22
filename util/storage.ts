import AsyncStorage from '@react-native-async-storage/async-storage'

export const store = async <T>(key: string, value: T): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            const now = await retrieve<T>(key)
            resolve(now)
        } catch (error) {
            reject(error)
        }
    })
};

export const remove = async (key: string,): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(key)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
};

export const retrieve = async <T>(key: string, ifNullValue: any = null): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (!value) {
                store(key, ifNullValue)
                return resolve(ifNullValue)
            }
            const parsed = JSON.parse(value);
            resolve(parsed)
        } catch (error) {
            reject(error)
        }
    })
};

