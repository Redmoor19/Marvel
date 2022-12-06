import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=2b2fea049c10a95da4aa8b21503a4e64';
    //const _apiKey2 = 'apikey=ea7388980819e21ce26d4e13a0a6e74f';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map( item => _transformCharacter(item))
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`);
        return _transformCharacter(res.data.results[0])
    }

    const getComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map( item => _transformComics(item));
    }

    const getSingleComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0])
    };

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformComics = (comics) => {
        const newData = {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'No description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            price: comics.prices[0].price === 0 ? 'Not in sale' : `${comics.prices[0].price}$`,
            language: comics.textObjects.language || 'en-us',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension
        }
        return newData;
    }

    const _transformCharacter = (char) => {
        const newData = {
            id: char.id,
            name: char.name,
            description: char.description.length < 200 ? char.description : (char.description.slice(0, 200) + '...') ,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage:char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
        return newData
    }

    return {loading, error, getAllCharacters, getCharacter, getComics, getSingleComics, clearError, getCharacterByName, _baseOffset}
}

export default useMarvelService;