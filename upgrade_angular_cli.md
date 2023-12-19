1. Update your global Angular CLI: Sometimes, your global Angular CLI version might be incompatible with the local project. To update your global Angular CLI, you can run:

```
npm uninstall -g @angular/cli
npm cache verify
npm install -g @angular/cli@latest
```
2. After updating the global Angular CLI, navigate to your project directory and update your local Angular project:

```
cd /home/nikolay/Документи/projects/2023/Danny/CallCenter/TicketLine-master-2019-GitHub/frontend
npm uninstall --save-dev @angular/cli
npm install --save-dev @angular/cli@latest
```
3. Delete node_modules and package-lock.json, then reinstall the dependencies:

```
rm -rf node_modules package-lock.json
npm install
```