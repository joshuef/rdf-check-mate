import logger from '../logger';

const manualPlease = ( actualSchema, specificProp ) =>
{
    if( !actualSchema ) throw new Error( 'Pass a schema to retrieve documentation.' );
    if( typeof actualSchema !== 'object' ) throw new Error( 'Schema must be passed as an object' );
    if( specificProp && typeof specificProp !== 'string' ) throw new Error( 'To get documentation on a prop pass a string.' );

    const graph = actualSchema['@graph'];

    if( !graph ) throw new Error( 'No graph found on this schema.' )

    let manual = '';
    graph.forEach( ( prop, i ) =>
    {

        Object.entries( prop ).forEach( ( [key, value] ) =>
        {
            // ignore entries that aren't props of the schema
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

    return manual;
}


export default manualPlease
