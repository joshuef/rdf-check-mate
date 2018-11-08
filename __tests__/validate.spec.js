import validate from '../src/validator';

import { Book } from 'schema-doter';

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

const sampleObject = {
    'numberOfPages' : 4,
    'title'         : 'Dave',
    'author'        : 'me',
    'published'     : 'now',
    'publisher'     : 'yes '
};

describe( 'validate', () =>
{
    it( 'exists', () =>
    {
        expect( validate ).not.toBeUndefined()
    } );

    it( 'throws with nothing passed', () =>
    {
        expect( () =>
        {
            validate();
        } ).toThrowError( /reference/ )
    } )

    it( 'throws with a string passed', () =>
    {
        expect( () =>
        {
            validate( 'validate' );
        } ).toThrowError( /object/ )
    } )

    it( 'throws when no candidate passed', () =>
    {
        expect( () =>
        {
            validate( {} );
        } ).toThrowError( /candidate/ )
    } )

    it( 'returns true for a valid object', () =>
    {
        let valid;
        expect( () =>
        {
            valid = validate( Book, sampleObject );
        } ).not.toThrow()

        expect( valid ).toBeTruthy();
    } );

    it( 'returns false for an invalid object', () =>
    {
        let valid;
        expect( () =>
        {
            valid = validate( Book, {...sampleObject, numberOfPages: 4.2222} );

            // TODO: decide if this should actually throw or not.
        } ).not.toThrow()

        expect( valid ).toBeFalsy();
    } );

} )
