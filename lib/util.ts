import { AscentFilterType } from "@/types";

export function buildAscentQuery(query: string | undefined, queryBy: AscentFilterType | undefined) {
  if (!query || !queryBy) return {};
  return queryBy == "route"
    ? {
        where: {
          route: {
            contains: String(query),
            mode: "insensitive",
          },
        },
      }
    : {
        where: {
          OR: [
            {
              author: {
                firstName: {
                  contains: String(query),
                  mode: "insensitive",
                },
              },
            },
            {
              author: {
                lastName: {
                  contains: String(query),
                  mode: "insensitive",
                },
              },
            },
            {
              registeredParticipants: {
                some: {
                  OR: [
                    {
                      firstName: {
                        contains: String(query),
                        mode: "insensitive",
                      },
                    },
                    {
                      lastName: {
                        contains: String(query),
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },
            },
            {
              unregisteredParticipants: {
                some: {
                  name: {
                    contains: String(query),
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
      };
}
