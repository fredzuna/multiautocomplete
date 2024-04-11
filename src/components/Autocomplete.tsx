import React, { useState, useEffect, useRef } from 'react';
import IDataItem from '../interfaces/IDataItem';
import apiService from '../api/apiService';
import useDebounce from '../hooks/useDebounce';
import Loader from './Loader';
import List from './List';
import { getLastCharacter, isSpecialCharacter } from '../utils';


export default function Autocomplete() {
    const [filterText, setFilterText] = useState<string>("");
    const [data, setData] = useState<IDataItem[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [specialChar, setSpecialChar] = useState<string>("");

    const [selectedValue, setSelectedValue] = useState<IDataItem[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedFilterText = useDebounce(filterText, 300);

    const onChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target

        setFilterText(value)

        const lastChar = getLastCharacter(value)

        if(isSpecialCharacter(lastChar)) {
            const length = selectedValue.length
            if(length > 0) {
                setSpecialChar(value)
            }
        }else {
            fetchData()
        }
    }

    const fetchData = async () => {
        if (!showOptions) {
            setIsLoading(true)
            const data = await apiService.getData();
            setData(data)
            setShowOptions(true)
            setIsLoading(false)
        }
    }

    const handleSelectItem = (item: IDataItem) => {
        setFilterText('')

        item.specialCharacter = specialChar;
        setSelectedValue(previous => [...previous, item])

        setShowOptions(false);
        inputRef.current?.focus()
    }

    const onClickInput = () => {
        setShowOptions(prev => !prev)
    }

    const handleClear = (value: IDataItem) => {
        const newItems = selectedValue.filter(item => item.id !== value.id)
        setSelectedValue(newItems)

        setFilterText('')
        inputRef.current?.focus()
    }

    useEffect(() => {
        const handleFilterChange = async (debouncedFilterText: string) => {
            try {
                if (showOptions) {
                    setIsLoading(true)
                    const filteredData = await apiService.filterData(debouncedFilterText);
                    setData(filteredData);
                    setIsLoading(false)
                }

            } catch (error) {
                console.error('Error filtering data:', error);
            }
        };

        handleFilterChange(debouncedFilterText);
    }, [debouncedFilterText]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // restorePreviousValue(selectedValue)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedValue]);

    const excludeSelectedItems = (originalList: IDataItem[], selectedValue: IDataItem[]) => {
        const newArray: IDataItem[] = [];
      
        for (let i = 0; i < originalList.length; i++) {
          if (!selectedValue.map(item => item.id).includes(originalList[i].id)) {
            newArray.push(originalList[i]);
          }
        }
      
        return newArray;
      }

    const options = excludeSelectedItems(data, selectedValue)

    return (
        <div
            ref={containerRef}
            className='autocomplete'
        >   
            <div className='autocomplete-input-container'>
                {selectedValue.map((value) => (
                    <div key={value.id} className='item-selected-container'>
                        <span>{value.specialCharacter}</span>
                        <div className='item-selected' >
                            <span>{value.name}</span>
                            <span onClick={() => handleClear(value)} className='clear-icon'> | [x]</span>
                        </div>
                    </div>
                ))}
                <input
                    className='filter-text'
                    type="text"
                    value={filterText}
                    onChange={onChangeFilter}
                    onFocus={fetchData}
                    onClick={onClickInput}
                    ref={inputRef}
                />
            </div>

            <div className='container'>
                {isLoading === true ?
                    <Loader />
                    :
                    (showOptions &&
                        <List
                            data={options}
                            handleSelectItem={handleSelectItem}
                            filterText={filterText}
                        />
                    )
                }
            </div>
        </div>
    )
}