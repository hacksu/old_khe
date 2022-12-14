# Kent Hack Enough

This is a monorepo that contains all the necessary components to run our annual event.

It consists of 3 main facets:

### API

The API is where all backend and server logic is defined.

This consists of defining data structures, interfacing with the database, sending emails, etc.

As part of this environment, the API has built-in reverse proxying to the other components. This is disabled when deployed to the server, as the high-performance [NGINX](https://www.nginx.com/) is used.

### Staff Management Portal

The Staff Management Portal is the main interface for admins and organizers to interface with the API.

This should implement all functionality needed by event organizers.
- Check-in
- Approving applicants
- Responding to Tickets
- ...etc

Because of this being a monorepo, the API calls are tighly coupled to the API code; allowing full TypeScript intellisense and validation.

### The App *(library)*

Because of the need for us to have a different website each year due to our theming practices; the App project within this monorepo is intended to act as a baseline for all our websites. It shall implement all logical functionality and provide useful component exports that can be consumed by other projects.

With this, one will be able to import `@khe~/app` as a dependency in any other NextJS project and it will be able to use these components.

For example, the Registration Form is usually very complicated and requires numerous validation steps to ensure a proper user experience. Because of this, this is offloaded here in the monorepo where one can have excellent TypeScript intellisense and validation as part of having the API in the same project. Thus, one would define the Registration Form here (but void of any major styling), allowing the form to be imported into the annual website as a simple `<RegistrationForm />` component.

This design style ensures that any logical code is located within this repository, and thus removes the potentiality of messing up the entire website simply by changing the yearly styles.


## Installation

### Install NodeJS
https://nodejs.org/en/download/

### Install Yarn
```bash
npm install --global yarn
```

### Clone the Repository

```bash
git clone https://github.com/hacksu/khe.git
```

### Install Dependencies
```bash
yarn install
```

## Usage

### Run in Development Mode
```bash
yarn dev
```

This exposes the following endpoints:

#### API
- http://localhost:5000/api

#### Frontend
- http://localhost:5000
- http://localhost:5001 *(do not use)*

#### Staff Management Portal
- http://staff.localhost:5000
- http://localhost:5002 *(do not use)*

### Building for Production

Development mode provides hot reloading and various other benefits; but these slow down the performance of the entire project.

If you want to test the project's real-world performance, you must build it and run it in its production state.

```bash
# Build for production; minify and condense files.
yarn build
```

### Starting a Production Build

When you have built the project, you may run it with the `start` command.

```bash
# Run the latest build of all projects
yarn start
```


### Running Projects Individually

You can use turborepo's [filter](https://turborepo.org/docs/core-concepts/filtering) argument to only run a specific project.

```bash
# Only run the API in dev mode
yarn dev --filter=api
```

```bash
# Build the API and the Frontend APP
yarn build --filter=api --filter=app
```


```bash
# Start the API
yarn start --filter=api
```

## Deployment

*Note: If you are conducting a fresh deployment, see the [server setup instruction](./docs/SERVER.md).*

[ IMPLEMENT AND DOCUMENT AUTOMATED DEPLOYMENT ]






