import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import SearchForm from '../searchForm/SearchForm';

import './charInfo.scss';


const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect( () => {
        loadCharacter();
        // eslint-disable-next-line
    }, []);

    useEffect( () => {
        loadCharacter();
        // eslint-disable-next-line
    }, [props.charId]);

    useEffect( () => {
        const element = document.querySelector('.char__flex');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                element.classList.add('sticky')
            } else {
                element.classList.remove('sticky')
            }
        })

        return window.removeEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                element.classList.add('sticky')
            } else {
                element.classList.remove('sticky')
            }
        });
    })

    const loadCharacter = () => {
        if (!props.charId) {
            return
        }
        clearError();        
        getCharacter(props.charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const skeleton = char || loading || error ? null : <Skeleton />
    const loaded = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const characters = !(loaded || error || !char) ? <Character char={char} /> : null;

    return (
        <div className="char__flex">
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {loaded}
                {characters}
            </div>
            <div className='char__search'>
                <SearchForm />
            </div>
        </div>
    )
}

const Character = (char) => {
    const {thumbnail, name, homepage, wiki, description, comics} = char.char;
    const fit = thumbnail.match(/image_not_available.jpg/) ? {objectFit: 'contain'} : null;
    const comicsArray = comics.slice(0, 10).map(item => {
        const id = item.resourceURI.match(/\d/g).join('');
        return (
            <li key={id} className="char__comics-item">
                <Link to={`comics/${id}`}>{item.name}</Link>
            </li>
        )
    })
    
    return(
        <>
        <div className="char__basics">
            <img src={thumbnail} style={fit} alt={name}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">Homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
        <div className="char__descr">
            {description ? description : 'No description for this character'}
        </div>
        {comics.length > 0 ? <div className="char__comics">Comics:</div> : "No comics available"}
            <ul className="char__comics-list">               
                {comicsArray}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
charId: PropTypes.number
}

export default CharInfo;