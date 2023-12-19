# Live URL

[Frontend](https://comcom.at/)
[Frontend Admin/User APP](https://app.comcom.at/)
[API Server](http://91.151.16.36:8001/api/swagger-ui/index.html#/)

# SEPM Group Phase

## First Steps

Navigate to the root folder of the project and execute `npm install`. Based on the _package.lock_ file, npm will download all required node_modules to run a Angular application.
Afterwards, execute `npm install -g @angular/cli` to install the Angular CLI globally.

## Development

### Development server

Run `ng serve` to start the web application. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### If you have issues with login from frontend:

### If you have issues with login from frontend:

1. go to [https://localhost:8443/](https://localhost:8443/)
2. you will see ![this](ssc/ssc1.png)
3. click advanced
4. You will see ![this](ssc/ssc2.png)
5. click "proceed to localhost (unsave)"
6. login from frontend [http://localhost:4200/](http://localhost:4200/)

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use `ng build --configuration production` for a production build.

### Build for production

`ng build --configuration production`
generated files are in the `dist` subfolder

### Copy files to server

`scp -r dist/fuse/* root@85.190.254.23:/usr/share/nginx/html/`

### Update Angular cli version

[Use this readme](./upgrade_angular_cli.md)

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Backend

1. Open command line in backend subfolder
2. `mvn clean install`.
3. `mvn liquibase:update`
4. `java -jar ComCom.jar`
