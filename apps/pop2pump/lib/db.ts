import postgres from "postgres";
export const pg = postgres(process.env.DB!, {
  max: process.env.NODE_ENV === "development" ? 10 : 50,
  idle_timeout: 10,
  connect_timeout: 30,
  ssl: true,
  connection: {
    application_name: "iotexscan",
  },
  debug: process.env.DEBUG === "true" ?
  function (connection, query, params, types) {
    // console.log(chalk.blue(JSON.stringify(params)))
    const newQuery = query.replace(/\$(\d+)/g, (match, p1) => {
      const replace = params[p1 - 1]
      if (typeof replace === "string") {
        return `'${replace}'`
      }
      return replace
    })
    console.log(newQuery)
  }: false
});
