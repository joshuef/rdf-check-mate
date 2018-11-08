# RDF Check Mate

<!-- |Linux/OS X|Windows|Coverage Status|
|:---:|:---:|:---:|
|[![Build Status](https://travis-ci.org/joshuef/node-cli-starter.svg?branch=master)](https://travis-ci.org/joshuef/node-cli-starter)|[![Build status](https://ci.appveyor.com/api/projects/status/uqlsh2o5e5qxfw2s?svg=true)](https://ci.appveyor.com/project/joshuef/node-cli-starter)|[![Coverage Status](https://coveralls.io/repos/github/joshuef/node-cli-starter/badge.svg?branch=master)](https://coveralls.io/github/joshuef/node-cli-starter?branch=master)| -->


Validation and documentation generation for JSON-LD schemas (in the schema.org fashion).

Currently _very_ naive proof of concept.

## Setup:

Install using yarn (needed for postinstall script/retrieval)
`yarn`

## Use 

Valid:

```
// Checking against Book schema from schema.org
import { Book } from 'schema-doter';

const sampleObject = {
    'numberOfPages' : 4,
    'title'         : 'Dave',
    'author'        : 'me',
    'published'     : 'now',
    'publisher'     : 'yes '
};

valid = validate( Book, {...sampleObject, numberOfPages: 4.2222} );

// This warns in console:
//
// There is some incompatability between your provided object and the schema...
//  title , published do not exist on this schema

// But:
console.log( valid ) // true
```

Invalid:
```
const badObject = {
    'numberOfPages' : 4.1,
    'title'         : 'Dave',
    'author'        : 'me',
    'published'     : 'now',
    'publisher'     : 'yes '
};

valid = validate( Book, {...badObject, numberOfPages: 4.2222} );
console.log( valid ) // false

// also throws:
// Candidate data type error: 4.1 is number should be: Integer

```
            
            
## TODO 

- Publish as npm package?
    - Setup main script / build / etc
- Add tests
- use RDFlib for extracting props etc.
- setup CI
- Add validity checks for more data types and classes etc
