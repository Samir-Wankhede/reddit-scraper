export default function cleanText(text) {
    // Replace escape characters
    text = text.replace(/\n|\r|\\t|\\b|\\f|\\v|\\0+|amp;/g, '');
  
    // Remove the square brackets but keep the text inside
    text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
  
    // Replace any remaining square brackets
    text = text.replace(/\[|\]/g, '');
  
    return text;
  }