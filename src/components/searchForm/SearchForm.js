import './searchForm.scss';
import {Formik, Field, Form, ErrorMessage } from 'formik';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import Spinner from '../spinner/Spinner';

import useMarvelService from '../../services/MarvelService';

const SearchForm = () => {
    const {loading, getCharacterByName} = useMarvelService();
    const [char, setChar] = useState();

    const loaded = loading ? <Spinner /> : null;
    const display = !(loaded || !char) ? <Display char={char} /> : null;

    return(
        <div className='search'>
            <Formik
                initialValues ={ {search: ''}}
                validate={ values => {
                    const errors = {};

                    if (!values.search) {
                        errors.search = 'This field is required';
                    }

                    return errors;
                }}
                onSubmit={values => {
                    getCharacterByName(values.search)
                        .then(data => setChar(data))
                        .catch( () => setChar('The character was not found. Check the name and try again'));
                    values.search = '';
                }}>
                    <Form>
                        <label className='search__label' htmlFor='search'>Or find a character by name: </label>
                        <div className="searchContainer">
                            <div className="search__flex">
                                <Field 
                                    type='text' 
                                    name='search' 
                                    placeholder='Enter name'
                                    className='search__field'/>
                                <button type='submit' className='button button__main'>
                                    <div className="inner">FIND</div>
                                </button>
                            </div>
                            <div className="search__message">
                                <ErrorMessage name='search'>{ msg => <div className='search__error'>{msg}</div> }</ErrorMessage>
                                <div>
                                    {loaded}
                                    {display}
                                </div>
                            </div>
                        </div>
                    </Form>
            </Formik>
        </div>
    )
}

const Display = ({char}) => {
    if (char && char.id) {
        return (
            <div className='search__success'>
                <div className='search__success-text'>There is! Visit {char.name} page?</div>
                <Link to={`/${char.id}`} className="button button__secondary">
                    <div className="inner">TO PAGE</div>
                </Link>
            </div> 
        )
    } else if (char && !char.id) {
        return (
            <div className='search__error'>
                The character was not found. Check the name and try again
            </div>
        )
    } else {
        return 
    };
}

export default SearchForm;