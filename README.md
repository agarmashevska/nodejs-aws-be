# nodejs-aws-be

## What was done

1) product-service is done

    ##### Additional scope:

    - Async/await is used in lambda functions
    - ES6 modules are used for product-service implementation
    - Webpack is configured for product-service
    - SWAGGER documentation is created for product-service
    - Lambda handlers are covered by basic UNIT tests
    - Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase.
    - Main error scenarious are handled by API ("Product not found" error, try catch blocks are used in lambda handlers).
    
2) Link to product-service API:
 - [products](https://uk86gb8i4h.execute-api.eu-west-1.amazonaws.com/dev/products/) :
 ```
https://uk86gb8i4h.execute-api.eu-west-1.amazonaws.com/dev/products
```
 - [product with id](https://uk86gb8i4h.execute-api.eu-west-1.amazonaws.com/dev/products/e1c9e732-c589-40c5-8623-d61b8f0b310b) :
```
https://uk86gb8i4h.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}
```

3) Link to FE MR - 