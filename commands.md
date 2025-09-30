# Generate the Prisma client (always after schema change)
npx prisma generate

# Run pending migrations on the database
npx prisma migrate dev --name init

# Create a new migration (example: add_user_provider_field)
npx prisma migrate dev --name add_user_provider_field

# Push schema to DB without migrations (not recommended for prod)
npx prisma db push

# Open Prisma Studio (GUI to view/edit DB)
npx prisma studio



# Run in dev mode (with auto-reload, TypeScript directly)
npm run dev

# Build project into /dist (compiled JS)
npm run build

# Run compiled JS (production mode)
npm start




npx prisma migrate dev --name some_migration
npx prisma generate
npm run dev



