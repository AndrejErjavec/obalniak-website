FROM node:lts-bookworm

WORKDIR /app

# Copy only package files to install deps
COPY package.json package-lock.json* ./  

# Copy the rest of the application
COPY . .

# Install node dependencies
RUN npm install

# Generate Prisma client
# RUN npx prisma generate

# Set the default command
CMD ["npm", "run", "dev"]
