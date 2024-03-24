import React, { useRef } from 'react';

const SideNav = ({ searchLimit, totalAvailableStories, totalAvailableComics, handleSort }) => {
    const inputRefs = useRef([]);

    const clearSelection = () => {
        inputRefs.current.forEach(input => (input.checked = false));
        handleSort('alphabetical'); // Reset sorting to alphabetical order
    };

    const handleCheckboxChange = (option) => {
        handleSort(option);
    };

    return (
        <div className="sidenav">
            <div className="statistics">
                <h3>Heroes: {searchLimit}</h3>
                <h3>Stories available: {totalAvailableStories}</h3>
                <h3>Comics available: {totalAvailableComics}</h3>
            </div>

            <div className="sort-options">
                <h3>Sort</h3>
                <div>
                    <input
                        ref={(el) => inputRefs.current.push(el)}
                        type="checkbox"
                        id="newest"
                        name="sort"
                        className="input"
                        onChange={() => handleCheckboxChange('newest')}
                    />
                    <label htmlFor="newest" className="label">
                        Newest
                    </label>
                </div>

                <div>
                    <input
                        ref={(el) => inputRefs.current.push(el)}
                        type="checkbox"
                        id="oldest"
                        name="sort"
                        className="input"
                        onChange={() => handleCheckboxChange('oldest')}
                    />
                    <label htmlFor="oldest" className="label">
                        Oldest
                    </label>
                </div>

                <div>
                    <input
                        ref={(el) => inputRefs.current.push(el)}
                        type="checkbox"
                        id="comics"
                        name="sort"
                        className="input"
                        onChange={() => handleCheckboxChange('comics')}
                    />
                    <label htmlFor="comics" className="label">
                        By Comics
                    </label>
                </div>

                <div>
                    <input
                        ref={(el) => inputRefs.current.push(el)}
                        type="checkbox"
                        id="stories"
                        name="sort"
                        className="input"
                        onChange={() => handleCheckboxChange('stories')}
                    />
                    <label htmlFor="stories" className="label">
                        By Stories
                    </label>
                </div>

                <button className="clear-button" onClick={clearSelection}>
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SideNav;

