# DAF as a Service Documentation

This repository contains the documentation for using Endaoment's Donor Advised Fund (DAF) as a Service API.
This API allows you to create and manage Donor Advised Funds as a third-party service, while leveraging Endaoment's expertise in charitable giving.

## Overview

This documentation is broken down into a quickstart example and flow guides.
The quickstart example is a copyable working implementation of the DAF as a Service API, while the flow guides provide a more in-depth look at the API, its features, and how to use them.

## Before you begin
Make sure to reach out to the Endaoment team to get your OAuth Credentials, which will allow you to log users into Endaoment from your application. 

You can do so by opening a ticket [here](https://discord.com/channels/734855436276334746/890622199390699580).

## Documentation

1. [User Login](docs/login-user.md)
2. [Open a DAF](docs/open-daf.md)
3. [Donate to a DAF](docs/donate-to-daf.md)
4. [Search for an Organization](docs/search-for-org.md)
5. [Grant from a DAF](docs/grant-from-daf.md)

## Working Code Sample

### Setting up your environment

1. Set up and install `nvm`
   - [Linux and Mac](https://github.com/nvm-sh/nvm)
   - [Windows](https://github.com/coreybutler/nvm-windows)
2. Using nvm, install Node v22.11.0 or higher (LTS at time of writing is v22.14.0 so `nvm install --lts` should work)
   - Confirm installation by running `node -v` on the command line
3. Install yarn with `npm install --global yarn`
   - Confirm installation by running `yarn -v` on the command line

### Running the Application

1. Set up the [API](./quickstart/backend/README.md)
2. Set up the [Frontend App](./quickstart/frontend/README.md)
3. You should be able to see the application working
