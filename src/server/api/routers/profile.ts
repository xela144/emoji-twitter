import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

import {
  createTRPCRouter as router,
  publicProcedure as procedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = router({
  getUser: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }
      return filterUserForClient(user);
    }),
});
