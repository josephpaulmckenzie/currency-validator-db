class FileNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileNotFoundError';
  }
}

class TextDetectionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Text Detetction Error';
  }
}

export {FileNotFoundError, TextDetectionsError};
