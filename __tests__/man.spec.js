import man from '../src/manual';
import { Book } from 'schema-doter'

describe( 'man', () =>
{
    it( 'exists', () =>
    {
        expect( man ).not.toBeUndefined()
    } );

    it( 'throws with nothing passed', () =>
    {
        expect( () =>
        {
            man();
        } ).toThrowError( /Pass/ )
    } )

    it( 'throws without an object passed', () =>
    {
        expect( () =>
        {
            man( 'string' );
        } ).toThrowError( /Schema/ )
    } )


    it( 'returns a manual', () =>
    {
        expect( () =>
        {
            man( Book );
        } ).not.toThrow()

        const receivedMan = man( Book );
        expect( receivedMan ).not.toBeNull();
        expect( receivedMan ).not.toBeUndefined();
        expect( receivedMan ).toMatch( 'numberOfPages :  The number of pages in the book' );
    } )

    it( 'returns specific prop info', () =>
    {
        expect( () =>
        {
            man( Book );
        } ).not.toThrow()

        const receivedMan = man( Book, 'name'  );
        expect( receivedMan ).toMatch( 'name :  The name of the item' );
    } )

} )
