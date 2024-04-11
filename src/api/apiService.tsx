import IDataItem from '../interfaces/IDataItem';
import { removeSpecialCharacter } from '../utils';
const apiService = {
    getData: async (): Promise<IDataItem[]> => {
        const data =  await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete')
        const result = await data.json();
        return result
    },

    filterData: async (filterText: string): Promise<IDataItem[]> => {
        const result =  await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete')
        const data = await result.json();


        
        const text = removeSpecialCharacter(filterText)
        console.log(text)

        const filteredData = data.filter((item: IDataItem) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );

        return filteredData
    }
};

export default apiService;