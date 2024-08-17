import { QUERY_FLAG_CLOSE, QUERY_FLAG_OPEN } from '../constants';
import { isSupportedQueryType } from './is-supported-query-type.fn';

/**
 * Detect the queries in the given string. Ignores duplicates and ignores unsupported query types
 * @param text
 */
export const findQueries = (text: string): string[] => {
  const retVal: string[] = [];
  let queryBuffer = ''; // Buffer to accumulate multi-line queries
  let isInsideQuery = false; // Flag to indicate if we're inside a query block

  const lines: string[] = text.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith(QUERY_FLAG_OPEN)) {
      isInsideQuery = true; // Start of a query block
      queryBuffer += trimmedLine.replace(QUERY_FLAG_OPEN, '').trim() + '\n';
    } else if (isInsideQuery) {
      queryBuffer += trimmedLine + '\n'; // We're inside a query block, continue...
    }

    // Check if we're ending a query block
    if (trimmedLine.endsWith(QUERY_FLAG_CLOSE)) {
      isInsideQuery = false;
      queryBuffer = queryBuffer.replace(QUERY_FLAG_CLOSE, '').trim();

      // Ensure it's a supported query type
      if (queryBuffer && isSupportedQueryType(queryBuffer)) {
        retVal.push(queryBuffer);
      }

      // Clear the buffer for the next query
      queryBuffer = '';
    }
  }

  // Handle any remaining buffer in case the QUERY_FLAG_CLOSE is missing
  if (isInsideQuery && queryBuffer) {
    queryBuffer = queryBuffer.trim();
    if (isSupportedQueryType(queryBuffer)) {
      retVal.push(queryBuffer);
    }
  }

  return retVal;
};
