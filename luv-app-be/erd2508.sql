CREATE TABLE "users" (
  "_id" "ObjectId" PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "avatar" varchar,
  "displayName" varchar NOT NULL,
  "role" enum(admin,streamer,viewer) DEFAULT 'viewer',
  "isActive" boolean DEFAULT true,
  "lastLoginAt" timestamp,
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now())
);

CREATE TABLE "streamers" (
  "_id" "ObjectId" PRIMARY KEY,
  "userId" "ObjectId",
  "stageName" varchar NOT NULL,
  "bio" text,
  "isVerified" boolean DEFAULT false,
  "totalFollowers" int DEFAULT 0,
  "totalViews" bigint DEFAULT 0,
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now())
);

CREATE TABLE "streams" (
  "_id" "ObjectId" PRIMARY KEY,
  "streamerId" "ObjectId",
  "title" varchar NOT NULL,
  "description" text,
  "thumbnail" varchar,
  "category" varchar NOT NULL,
  "status" enum(scheduled,live,ended) DEFAULT 'scheduled',
  "scheduledAt" timestamp,
  "startedAt" timestamp,
  "endedAt" timestamp,
  "maxViewers" int DEFAULT 0,
  "totalViewers" int DEFAULT 0,
  "streamKey" varchar UNIQUE,
  "playbackUrl" varchar,
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now())
);

CREATE TABLE "followers" (
  "_id" "ObjectId" PRIMARY KEY,
  "followerId" "ObjectId",
  "streamerId" "ObjectId",
  "followedAt" timestamp DEFAULT (now())
);

CREATE TABLE "donations" (
  "_id" "ObjectId" PRIMARY KEY,
  "streamId" "ObjectId",
  "donorId" "ObjectId",
  "streamerId" "ObjectId",
  "amount" decimal NOT NULL,
  "message" text,
  "status" enum(pending,completed,failed) DEFAULT 'pending',
  "createdAt" timestamp DEFAULT (now())
);

CREATE TABLE "chatMessages" (
  "_id" "ObjectId" PRIMARY KEY,
  "streamId" "ObjectId",
  "senderId" "ObjectId",
  "message" text NOT NULL,
  "createdAt" timestamp DEFAULT (now())
);

CREATE INDEX ON "users" ("username");

CREATE INDEX ON "users" ("email");

CREATE INDEX ON "users" ("role");

CREATE INDEX ON "streamers" ("userId");

CREATE INDEX ON "streamers" ("stageName");

CREATE INDEX ON "streams" ("streamerId");

CREATE INDEX ON "streams" ("status");

CREATE INDEX ON "streams" ("scheduledAt");

CREATE UNIQUE INDEX ON "followers" ("followerId", "streamerId");

CREATE INDEX ON "followers" ("streamerId");

CREATE INDEX ON "donations" ("streamId");

CREATE INDEX ON "donations" ("donorId");

CREATE INDEX ON "donations" ("streamerId");

CREATE INDEX ON "chatMessages" ("streamId");

CREATE INDEX ON "chatMessages" ("createdAt");

ALTER TABLE "streamers" ADD FOREIGN KEY ("userId") REFERENCES "users" ("_id");

ALTER TABLE "streams" ADD FOREIGN KEY ("streamerId") REFERENCES "streamers" ("_id");

ALTER TABLE "followers" ADD FOREIGN KEY ("followerId") REFERENCES "users" ("_id");

ALTER TABLE "followers" ADD FOREIGN KEY ("streamerId") REFERENCES "streamers" ("_id");

ALTER TABLE "donations" ADD FOREIGN KEY ("streamId") REFERENCES "streams" ("_id");

ALTER TABLE "donations" ADD FOREIGN KEY ("donorId") REFERENCES "users" ("_id");

ALTER TABLE "donations" ADD FOREIGN KEY ("streamerId") REFERENCES "streamers" ("_id");

ALTER TABLE "chatMessages" ADD FOREIGN KEY ("streamId") REFERENCES "streams" ("_id");

ALTER TABLE "chatMessages" ADD FOREIGN KEY ("senderId") REFERENCES "users" ("_id");
