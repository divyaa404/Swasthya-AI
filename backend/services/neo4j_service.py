import os
from neo4j import GraphDatabase
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

class Neo4jService:
    def __init__(self, uri: str, username: str, password: str):
        if not uri:
            print("[Neo4jService] Warning: NEO4J_URI is not set.")
        self.driver = GraphDatabase.driver(uri, auth=(username, password)) if uri else None
    
    def execute(self, query: str, parameters: dict = None) -> List[Dict]:
        """Execute query and return results as list of dicts"""
        if not self.driver:
            print("[Neo4jService] Error: Driver not initialized.")
            return []
        with self.driver.session() as session:
            result = session.run(query, parameters or {})
            return result.data()
    
    def close(self):
        if self.driver:
            self.driver.close()

# Initialize
neo4j_uri = os.getenv("NEO4J_URI")
neo4j_user = os.getenv("NEO4J_USERNAME") or os.getenv("NEO4J_USER") or "neo4j"
neo4j_password = os.getenv("NEO4J_PASSWORD")

print(f"[Neo4jService] Connecting to {neo4j_uri} as user: {neo4j_user}")

neo4j = Neo4jService(
    uri=neo4j_uri,
    username=neo4j_user,
    password=neo4j_password
)
