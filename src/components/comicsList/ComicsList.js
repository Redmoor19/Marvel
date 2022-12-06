import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(10);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [comicsLeft, setComicsLeft] = useState(true); 

    const {loading, error, getComics} = useMarvelService();

    useEffect( () => {
        loadComics(offset)
        // eslint-disable-next-line
    }, [])

    const saveComics = (newData) => {
        newData < 8 && setComicsLeft(false); 
        setComics([...comics, ...newData]);
        setOffset( offset => offset + 8);
        setItemsLoading(false);
    }

    const loadComics = (offset) => {
        setItemsLoading(true);
        getComics(offset)
            .then(saveComics)
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const comicsList = comics ? comics.map( (item, i) => {
        const fit = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? {objectFit: 'contain'} : null;
        return (
            <li key={i} className="comics__item">
                <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} alt="ultimate war" className="comics__item-img" style={fit}/>
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.price}</div>
                </Link>
            </li>
        )
    }) : null
    const display = comicsLeft ? 'block' : 'none';

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            <ul className="comics__grid">
                {comicsList}
            </ul>
            <button 
                className="button button__main button__long"
                disabled={itemsLoading}
                onClick={() => {loadComics(offset)}}
                style={{'display':`${display}`}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;