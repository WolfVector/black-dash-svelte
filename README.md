# Black Dash

**Your IoT dashboard in minutes**

With Black Dash you will be able to create and manage your IoT Dashboard with just a mere of clicks, no code involved.
All you need to do is:
- Add your broker connection
- Add your subscribers
- See the results 

![Main page](/repo_info/img/main.JPG)

![Broker page](/repo_info/img/broker.JPG)

![Subscriber page](/repo_info/img/sub.JPG)

![New sub page](/repo_info/img/new_sub.JPG)

![Login page](/repo_info/img/sso.JPG)

## Installation

- Clone the repo
- `$ npm install`

### Database

The project uses prisma ORM and sqlite to handle the database. This repository has a `.env.example` file you can use to create your `.env` file. The `.env` is necessary for that is what prisma and other library uses to get sensible information. In other words, copy the content from the `.env.example`, create the `.env` file and paste it there.

**Migration**

`$ npx prisma migrate dev --name init`

This will migrate the schema to the db, generate a prisma client, and save default admin credentials.

## Authentication

As you can see from the images above, the project uses two methods for authentication: username-password and Azure Active Directory

The system has a default admin user, the credentials are:

- **username**: black-dash
- **password**: black-dash-password

When you login using the username-password method, you may notice that nothing happens, well, this is due to a minor bug in the authentication library, but don't worry, after login just go to the page **/settings** and you will be able to access the admin panel. Basically, the library is able to log you in, but it does not redirect you automatically to the admin panel (that is the bug)

The library used to handle authentications is <a href="https://github.com/nextauthjs/next-auth">next-auth</a>. Azure Active Directory method works ok, but as I said before, the library has a minor bug in the username-password method. However, the library is very popular and it is in constant development. But if you do not want to wait for the update, you can fix it by yourself, it is pretty easy. Just go to the next route and make the next modifications in the `signIn` function:

**/node_modules/@auth/sveltekit/client.js**
```js
// signIn function

const data = await res.clone().json();
const error = new URL(data.url).searchParams.get("error");

if ((redirect || !isSupportingReturn) && !error) {
    // TODO: Do not redirect for Credentials and Email providers by default in next major
    window.location.href = data.url ?? callbackUrl;
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (data.url.includes("#"))
        window.location.reload();
    return;
}
res.error = error

return res;
```

With that in place, the username-password method should redirect you automatically to the admin panel when loging in 

### Azure Active Directory

If you do not know how to register an application in Azure Portal, then I recommend you to follow the next tutorial: <a href="https://microsoft.github.io/MicrosoftCloud/tutorials/docs/Authentication-App-With-NextJs-And-Microsoft-Graph/Configuring-Application-Azure-Active-Directory">https://microsoft.github.io/MicrosoftCloud/tutorials/docs/Authentication-App-With-NextJs-And-Microsoft-Graph/Configuring-Application-Azure-Active-Directory</a>

For **redirect uris**, you can use:
- http://localhost:5173/auth/callback/azure-ad
- http://localhost:3000/auth/callback/azure-ad

You only have to follow the configuration part, all the other chapters are not necessary. Once you have registered your app, copy and paste the **client id**, **client secret** and **tenant id** to your `.env` file. Remember you can use the `.env.example` file as a template.

## Navigation

- **/**: main page
- **/login**: login page
- **/settings**: settings for the system (you can only access if you are an admin)

## Running in development mode

`$ npm run dev`

Go to <a href="http://localhost:5173/">localhost:5173</a>

## Running in production

Go to your `.env` file and define the variables `AUTH_URL`, `AUTH_TRUST_HOST` and `ORIGIN` according to your infrastructure. Again, you can use `.env.example` as a template 

- `$ npm run build`
- `$ node build/index.js`

Go to <a href="http://localhost:5173/">localhost:3000</a>

## Bugs/Help

If you need any help, you can open an issue :)
