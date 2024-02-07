export default class ValibotError extends Error {
  /**
   * @param {import('valibot').SchemaIssues} issues
   * @param {number} statusCode
   */
  constructor(issues, statusCode = 500) {
    const message = `[${issues[0].path.map((issue) => issue.key).join('.')}] ${issues[0].message}`;
    super(message);
    this.name = 'ValibotError';
    this.statusCode = statusCode;
  }
}
