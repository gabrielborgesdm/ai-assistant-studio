import { OllamaEmbeddings } from '@langchain/ollama'
import { FaissStore } from '@langchain/community/vectorstores/faiss'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { DEFAULT_OLLAMA_EMBEDDINGS_MODEL } from '@global/const/consts'

/**
 * Service for handling Retrieval-Augmented Generation (RAG) functionalities.
 * This service is responsible for processing local documents, creating vector embeddings,
 * and retrieving relevant context to be injected into the assistant's prompt.
 */
export class RagService {
  /**
   * Retrieves relevant context from documents in a specified directory based on a user query.
   * @param contextPath - The path to the directory containing the context documents.
   * @param query - The user's query to find relevant context for.
   * @returns A string containing the relevant context, or an empty string if an error occurs.
   */
  async getContext(contextPath: string, query: string): Promise<string> {
    try {
      const retriever = await this.getRetriever(contextPath)
      const context = await retriever.invoke(query)
      console.log('Context retrieved')

      const contextString = context
        .map((doc: any) => doc.pageContent)
        .join('\n\n--------------------\n\n')

      return contextString
    } catch (error) {
      console.error('Error getting context:', error)
      return ''
    }
  }

  /**
   * Creates a retriever for a given directory path.
   * This involves loading documents, splitting them into chunks, creating embeddings,
   * and setting up a vector store for retrieval.
   * @param contextPath - The path to the directory containing the context documents.
   * @returns A retriever instance.
   */
  async getRetriever(contextPath: string): Promise<any> {
    // Load documents from the specified directory, supporting .txt and .md files.
    const directoryLoader = new DirectoryLoader(contextPath, {
      '.txt': (path) => new TextLoader(path),
      '.md': (path) => new TextLoader(path),
      '.docx': (path) => new DocxLoader(path)
    })

    console.log('Loading documents...')
    const docs = await directoryLoader.load()
    console.log('Documents loaded: ', docs.length)

    // Split the documents into smaller chunks for more effective embedding and retrieval.
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })
    const splits = await textSplitter.splitDocuments(docs)
    console.log('Splits created: ', splits.length)

    // Create embeddings for the document chunks using a local Ollama model.
    const embeddings = new OllamaEmbeddings({
      model: DEFAULT_OLLAMA_EMBEDDINGS_MODEL
    })
    console.log('Embeddings created')

    // Create a FAISS vector store from the document splits and embeddings.
    // FAISS is a library for efficient similarity search and clustering of dense vectors.
    console.log('Creating vector store...')
    const vectorStore = await FaissStore.fromDocuments(splits, embeddings)
    console.log('Vector store created')

    // Create a retriever from the vector store to fetch relevant documents.
    console.log('Creating retriever...')
    const retriever = vectorStore.asRetriever()
    console.log('Retriever created')

    return retriever
  }
}
