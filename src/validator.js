import fs from 'fs-extra';
import path from 'path';
import logger from './logger';

import { Book } from 'schema-doter'
// import {
//     outputFolder,
//     outputFolderSchemaDefinitions
// } from './constants';

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// const termChosen = 'Book';
const sampleObject = {
    'numberOfPages' : 4.1, 'title'         : 'Dave', 'author'        : 'me', 'published'     : 'now', 'publisher'     : 'yes ' };


const getSampleProps = async ( actualSchema, filterObject ) =>
{
    if( !filterObject )
        return new Error( 'No object to check passed in...' )

    const ourObject = {};

    const graph = actualSchema['@graph'];

    const filterObjectKeysArray = filterObject ? Object.keys( filterObject ) : null;

	 // return nonexistent....
    graph.forEach( ( prop, i ) =>
    {

        Object.entries( prop ).forEach( ( [key, value] ) =>
        {

            if( key === '@type' && value !== 'Property' )
                return;

            // with a label for this prop, we show what it is...
            if( key === 'rdfs:label' )
            {
                if( filterObject && !filterObjectKeysArray.includes( value ) )
                    return;


                ourObject[ value ] = prop['rdfs:comment'];

            }
        } )

    } );

    return ourObject;
}




const yourPropsDontExist = async ( actualSchema, filterObject ) =>
{
    if( !filterObject )
        return new Error( 'No object to check passed in...' )

    // const ourObject = {};
    const graph = actualSchema['@graph'];

    const filterObjectKeysArray = filterObject ? Object.keys( filterObject ) : null;
    const nonexistentPropsObject = { ...filterObject };
	 // return nonexistent....
    graph.forEach( ( prop, i ) =>
    {

        Object.entries( prop ).forEach( ( [key, value] ) =>
        {

            if( key === '@type' && value !== 'Property' )
                return;

            // with a label for this prop, we show what it is...
            if( key === 'rdfs:label' )
            {
                if( filterObject && filterObjectKeysArray.includes( value ) )
                {

                    delete nonexistentPropsObject[ value ];
                }


            }
        } )

    } );

    return Object.keys( nonexistentPropsObject );
}





const manualPlease = async ( actualSchema, specificProp ) =>
{
    const graph = actualSchema['@graph'];

    let manual = '';
    graph.forEach( ( prop, i ) =>
    {

        Object.entries( prop ).forEach( ( [key, value] ) =>
        {

            if( key === '@type' && value !== 'Property' )
                return;

            // with a label for this prop, we show what it is...
            if( key === 'rdfs:label' )
            {
                if( specificProp && value !== specificProp )
                    return;

                manual +=  `\t ${value} :  ${prop['rdfs:comment']} \n`
            }
        } )

    } );

    logger.trace( manual );
}



// const getYourObject = async ( ) => {
//
// 	let outObject = await getSampleProps(termChosen);
//
// 	console.log('Definitions you could be using: ', outObject)
// }


// getYourObject();

const schemasWeCheck = [ 'Text', 'Number', 'Date', 'DateTime', 'URL', 'Integer', 'Boolean' ]
    .map( s => `schema:${s}` ) ;

const checkThisMakesSensePlease = async ( actualSchema, filterObject ) =>
{
    if( !filterObject )
        return new Error( 'No object to check passed in...' )

    const graph = actualSchema['@graph'];

    const filterObjectKeysArray = filterObject ? Object.keys( filterObject ) : null;
    // const nonexistentPropsObject = { ...filterObject };
	 // return nonexistent....
    graph.forEach( ( prop, i ) =>
    {

        let thisProp;
        Object.keys( prop ).forEach( ( key, i ) =>
        {

            // this counts on label being first.........
            // TODO: loop through all before doing this check...
            if( key === 'rdfs:label' )
            {
                thisProp = prop[key];
            }

            if( key === 'schema:rangeIncludes' )
            {

                let type = prop[key]['@id'];

                if( ! filterObject[ thisProp ] )
                    return;

                if( schemasWeCheck.includes( type ) )
                {
                    switch( type )
                    {
                        case 'schema:Text' : {
                            if( typeof filterObject[ thisProp ] !== 'string' )
                            {
                                console.error( 'ERRR', thisProp, 'is type ', typeof filterObject[ thisProp ], 'should be: Text' )
                            }
                            console.log( 'CHECKING TYYYYOPPPPPEEEEE', thisProp,  type )
                        }
                        case 'schema:Integer' : {
                            if( ! Number.isInteger( filterObject[ thisProp ] ) )
                            {
                                console.error( 'ERRR', thisProp, 'is type ', typeof filterObject[ thisProp ], 'should be: Integer' )
                            }
                            console.log( 'CHECKING TYYYYOPPPPPEEEEE', thisProp,  type )
                        }
                        case 'schema:Number' : {
                            if( isNaN( filterObject[ thisProp ] ) )
                            {
                                console.error( 'ERRR', thisProp, 'is type ', typeof filterObject[ thisProp ], 'should be: Number' )
                            }
                            console.log( 'CHECKING TYYYYOPPPPPEEEEE', thisProp,  type )
                        }
                        default : {
                            // do nothing
                        }
                    }

                }


            }
        } )

    } );

    // return Object.keys(nonexistentPropsObject);
}


const makeMineA = async ( actualSchema, yourObject ) =>
{

    let examples = await getSampleProps( actualSchema, yourObject );
    let ups = await yourPropsDontExist( actualSchema, yourObject );


    logger.info( 'You entered:::: ', yourObject );
    logger.info( 'With your object these props have the following examples: ', examples );
    logger.warn( 'These dont exist on the schema!: ', ups );

    await manualPlease( actualSchema, 'isFamilyFriendly' );


    let doesThisMakeSense = await checkThisMakesSensePlease( actualSchema, yourObject );
    // await manualPlease( actualSchema );
}

makeMineA( Book, sampleObject );
