import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { SwaggerUIProps } from "swagger-ui-react";

const SwaggerUI = dynamic<SwaggerUIProps>(import("swagger-ui-react"), {
  ssr: false,
});

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Honey Pot API Doc",
        version: "1.0",
      },
      servers: [
        {
          url: "https://app.honeypotfinance.xyz/api/",
        },
      ],
      paths: {
        "/fto/getftoinfo": {
          get: {
            summary: "Get FTO Info",
            description: "Get FTO Info",
            parameters: [
              {
                name: "ftoaddress",
                in: "query",
                required: true,
                schema: {
                  type: "string",
                },
              },
              {
                name: "chainid",
                in: "query",
                required: true,
                schema: {
                  type: "string",
                },
              },
              {
                name: "api_key",
                in: "query",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Success",
              },
              404: {
                description: "Not Found",
              },
            },
          },
        },
        "/fto/updatefto": {
          post: {
            summary: "Update FTO",
            description: "Update FTO",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      pair: {
                        type: "string",
                      },
                      chain_id: {
                        type: "number",
                      },
                      creator_api_key: {
                        type: "string",
                      },
                      twitter: {
                        type: "string",
                      },
                      telegram: {
                        type: "string",
                      },
                      website: {
                        type: "string",
                      },
                      description: {
                        type: "string",
                      },
                      projectName: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Success",
              },
              400: {
                description: "Bad Request",
              },
            },
          },
        },
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
