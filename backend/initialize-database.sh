#!/bin/bash

echo "Initializing E-Learning Platform databases..."

# Check if PostgreSQL is installed
if ! command -v psql >/dev/null 2>&1; then
  echo "PostgreSQL is not installed. Please install PostgreSQL first."
  exit 1
fi

# PostgreSQL connection information
PG_HOST="localhost"
PG_PORT="5432"
PG_USER="postgres"
PG_PASSWORD="postgres"

# Check connection to PostgreSQL
echo "Testing connection to PostgreSQL..."
if ! PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -c '\l' > /dev/null 2>&1; then
  echo "Cannot connect to PostgreSQL. Please check your connection settings."
  exit 1
fi

echo "Connection successful. Creating databases..."

# Clean up existing databases if needed (comment out if you want to keep existing data)
echo "Dropping existing databases if they exist..."
PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -c "DROP DATABASE IF EXISTS auth_service_db;" > /dev/null 2>&1
PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -c "DROP DATABASE IF EXISTS user_service_db;" > /dev/null 2>&1
PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -c "DROP DATABASE IF EXISTS course_service_db;" > /dev/null 2>&1
PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -c "DROP DATABASE IF EXISTS video_service_db;" > /dev/null 2>&1

# Run the initialization script
echo "Running the database initialization script..."
PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -f init-db.sql

# Check if the script was executed successfully
if [ $? -eq 0 ]; then
  echo "Database initialization completed successfully!"
  echo "Created the following databases:"
  echo "  - auth_service_db"
  echo "  - user_service_db"
  echo "  - course_service_db (with sample courses)"
  echo "  - video_service_db"
else
  echo "An error occurred during database initialization."
  exit 1
fi

# Connect to the course_service_db to verify courses are created
echo "Verifying course data..."
COURSE_COUNT=$(PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d course_service_db -t -c "SELECT COUNT(*) FROM courses;")

echo "Number of courses in database: $COURSE_COUNT"

echo "Database initialization complete! You can now start your backend services." 