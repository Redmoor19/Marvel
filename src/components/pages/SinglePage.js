import '../singlePage/singlePage.scss';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import { useParams, Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import {useState, useEffect} from 'react';

const SinglePage = ({type}) => {
    
    const {id} = useParams();
    const [data, setData] = useState({});
    const {loading, error, getSingleComics, getCharacter, clearError} = useMarvelService();

    useEffect( () => {
        switch (type) {
            case 'comic' :
                updateComic()
                break;
            case 'char' :
                updateCharacter()
                break;
            default: 
            console.log('Neither comic or character were')
        }
        // eslint-disable-next-line
    }, [id])

    const updateComic = () => {
        clearError();
        getSingleComics(id)
            .then(res => setData(res));
    }

    const updateCharacter = () => {
        clearError();
        getCharacter(id)
            .then(res => setData(res));
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const display = !loading && !error && <View data={data} type={type}/>

    return (
        <>
            {errorMessage}
            {spinner}
            {display}
        </>
    )
}

const View = ({data, type}) => {
    const {title, description, price, thumbnail, pageCount, language, name} = data;
    
    switch (type) {
        case 'comic' :
            return(
                <div className="single-comic">
                    <img src={thumbnail} alt="x-men" className="single-comic__img"/>
                    <div className="single-comic__info">
                        <h2 className="single-comic__name">{title}</h2>
                        <p className="single-comic__descr">{description}</p>
                        <p className="single-comic__descr">{pageCount}</p>
                        <p className="single-comic__descr">Language: {language}</p>
                        <div className="single-comic__price">{price}</div>
                    </div>
                    <Link to={'/comics'} className="single-comic__back">Back to all</Link>
                </div>
            )
        case 'char' :
            return(
                <div className="single-comic">
                    <img src={thumbnail} alt="x-men" className="single-comic__img"/>
                    <div className="single-comic__info">
                        <h2 className="single-comic__name">{name}</h2>
                        {description ? <p className="single-comic__descr">{description}</p> : <p className="single-comic__descr">There is no description about this character</p>}
                    </div>
                    <Link to={'/'} className="single-comic__back">Back to all</Link>
                </div>
            )
        default: 
        console.log('Neither comic or character were')
    }
}

export default SinglePage;