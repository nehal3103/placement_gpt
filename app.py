import logging
import openai
import csv
from flask import Flask, render_template, request, jsonify
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes

# Set up your OpenAI API key and other configurations
openai.organization = ""
openai.api_key = "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"

# Define the function to read CSV into vector document
def read_csv_into_vector_document(file, text_cols):
  with open(file, newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    text_data = []
    for row in csv_reader:
      text = ' '.join([row[col] for col in text_cols])
      text_data.append(text)
  return [Document(page_content=text) for text in text_data]

# Load data and set up the chain and history
data = read_csv_into_vector_document("data/Mentorship.csv", ["Name", "Company", "Application Month", "Eligibility", "Prize", "Description", "Link"])
embeddings = OpenAIEmbeddings(openai_api_key=openai.api_key)
vectors = FAISS.from_documents(data, embeddings)
chain = ConversationalRetrievalChain.from_llm(llm=ChatOpenAI(temperature=0.0, model_name='gpt-3.5-turbo', openai_api_key=openai.api_key), retriever=vectors.as_retriever())
conversation_history = []  # Initialize conversation history

# Add a logging module to log errors and other important events
logger = logging.getLogger(__name__)

@app.route("/")
def index():
  # Render the index template
  return render_template('index.html')

@app.route("/query", methods=["POST"])
def get_query_result():
    global conversation_history

    # Get the user's query and chat history
    query = request.json['query']

    # Generate a response
    response = chain({"question": query, "chat_history": conversation_history})["answer"]

    update_chat_history(query,response)

    # Return the response
    return jsonify({'answer': response})


def update_chat_history(query,response):
  global conversation_history
  conversation_history.append((query,response))

if __name__ == "__main__":
  app.run(debug=True)
