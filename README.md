This is a basic [Next.js](https://nextjs.org/) template with [Mantine Core & Notifications](https://mantine.dev/) setup.

## Getting Started

1. Run the development server:

    ```bash
    npm run dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Commands

-   Create a new migration

    ```bash
    npm run migrate:create migration-name
    ```

-   Run all migrations (_NOTE: This will run migrations that have not yet been run_)

    ```bash
    npm run migrate
    ```

-   Generate your database types. You should run this everytime after you have run a new migration.

    ```bash
    npm run db:generate
    ```

-   Run migrations from fresh i.e. after deleting everything in the database (_NOTE: This will nuke your database, and run all migrations_)

    ```bash
    npm run migrate:fresh
    ```

-   Run a single migration

    ```bash
    npm run migrate:up
    ```

-   Revert a single migration (_NOTE: This will only revert a single migration at a time. Mainly useful for development_)

    ```bash
    npm run migrate:down
    ```

-   Seed your database (_NOTE: This will insert example data into your database. Mainly useful for development_)

    ```bash
    npm run db:seed
    ```

-   Migrate fresh and seed the db in one command. Useful for the dev environment.

    ```bash
    npm run dev:reset-db
    ```

### TODO

-   [ ] Fix `csgo-sharecode` package import
-   [ ] Show crosshair style within preview
-   [ ] toggle between 16:9 vs 4:3 for crosshair preview
-   [ ] allow user to save crosshair
-   [ ] validation on converter page

-   [ ] create login
-   [ ] create ui for entering in and saving crosshairs
