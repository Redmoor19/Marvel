import './charList.scss';

import { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'

const  CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(null);
    const [charEnded, setCharEnded] = useState(false); 

    const {loading, error, getAllCharacters, _baseOffset} = useMarvelService();

    useEffect( () => {
       if (!offset) {
            setOffset(_baseOffset);
        }
        getChars();
        // eslint-disable-next-line
    }, [])

    const getChars = (offset) => {
        setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded)
    }

    const onCharsLoaded = (newData) => {
        if (newData.length < 9) {
            setCharEnded(true);
        }

        setCharList(charList => [...charList, ...newData]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach( item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderItems = (arr) => {
        const items = arr.map(({id, thumbnail, name}, i) => {
            const fit = thumbnail.match(/image_not_available.jpg/) ? {objectFit: 'contain'} : null;

            return(
                <li 
                    key={i}
                    ref={el => itemRefs.current[i] = el}
                    tabIndex={0}
                    onClick={() => {
                        props.onCharSelected(id)
                        focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
                            focusOnItem(i);
                        }}}
                    className="char__item">
                    <img src={thumbnail} alt="abyss" style={fit}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const loaded = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const characters = renderItems(charList);

    return (
        <div className="char__list">
            {loaded}
            {errorMessage}
            {characters}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: charEnded ? 'none': 'block'}}
                onClick={() => getChars(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}


export default CharList;