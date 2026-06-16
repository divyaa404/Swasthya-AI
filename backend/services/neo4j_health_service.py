from neo4j import GraphDatabase
from typing import Dict, List
import os

class Neo4jHealthService:
    def __init__(self):
        # Support both NEO4J_USERNAME and NEO4J_USER
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USERNAME") or os.getenv("NEO4J_USER") or "neo4j"
        password = os.getenv("NEO4J_PASSWORD")
        
        if not uri or not password:
            print("[Neo4jHealthService] Warning: NEO4J_URI or NEO4J_PASSWORD not set in environment.")
            
        self.driver = GraphDatabase.driver(
            uri or "bolt://localhost:7687",
            auth=(user, password or "")
        )
    
    def create_user(self, patient_id: str, name: str, age: int):
        """Create user node"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                SET u.name = $name,
                    u.age = $age,
                    u.created_at = datetime()
            """, patient_id=patient_id, name=name, age=age)

    def link_family_member(self, patient_id: str, relative_id: str):
        """Create bidirectional family connection"""
        with self.driver.session() as session:
            session.run("""
                MATCH (u1:User {id: $patient_id})
                MATCH (u2:User {id: $relative_id})
                MERGE (u1)-[:FAMILY_MEMBER]->(u2)
                MERGE (u2)-[:FAMILY_MEMBER]->(u1)
            """, patient_id=patient_id, relative_id=relative_id)
    
    def save_symptom(self, patient_id: str, symptom_name: str, severity: int, date: str):
        """Save symptom"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (s:Symptom {name: $symptom_name})
                MERGE (u)-[r:HAS_SYMPTOM]->(s)
                SET r.severity = $severity,
                    r.since = $date,
                    r.last_reported = $date,
                    r.status = 'active'
            """, patient_id=patient_id, symptom_name=symptom_name, 
                severity=severity, date=date)

    def save_condition(self, patient_id: str, condition_name: str, status: str, date: str):
        """Save condition"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (c:Condition {name: $condition_name})
                MERGE (u)-[r:HAS_CONDITION]->(c)
                SET r.status = $status,
                    r.diagnosed_date = $date
            """, patient_id=patient_id, condition_name=condition_name, status=status, date=date)
    
    def save_fact(self, patient_id: str, fact_text: str, category: str, date: str):
        """Save general health fact"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                CREATE (f:HealthFact {
                    text: $fact_text,
                    category: $category,
                    date: $date,
                    id: randomUUID()
                })
                CREATE (u)-[r:HAS_HEALTH_FACT]->(f)
            """, patient_id=patient_id, fact_text=fact_text, 
                category=category, date=date)

    def save_allergy(self, patient_id: str, allergen: str, severity: str, date: str):
        """Save allergy"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (a:Allergy {name: $allergen})
                MERGE (u)-[r:HAS_ALLERGY]->(a)
                SET r.severity = $severity,
                    r.last_reported = $date
            """, patient_id=patient_id, allergen=allergen, severity=severity, date=date)
    
    def save_surgery(self, patient_id: str, surgery_name: str, date: str, notes: str = ""):
        """Save surgery"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                CREATE (s:Surgery {
                    name: $surgery_name,
                    date: $date,
                    notes: $notes,
                    id: randomUUID()
                })
                CREATE (u)-[r:HAD_SURGERY]->(s)
            """, patient_id=patient_id, surgery_name=surgery_name, 
                date=date, notes=notes)
    
    def save_medication(self, patient_id: str, med_name: str, dosage: str, frequency: str, date: str):
        """Save medication"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (m:Medication {name: $med_name})
                MERGE (u)-[r:TAKES_MEDICATION]->(m)
                SET r.dosage = $dosage,
                    r.frequency = $frequency,
                    r.started_date = $date
            """, patient_id=patient_id, med_name=med_name, 
                dosage=dosage, frequency=frequency, date=date)

    def save_vaccination(self, patient_id: str, vaccine_name: str, date: str):
        """Save vaccine"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (v:Vaccination {name: $vaccine_name})
                MERGE (u)-[r:RECEIVED_VACCINE]->(v)
                SET r.date = $date
            """, patient_id=patient_id, vaccine_name=vaccine_name, date=date)

    def save_habit(self, patient_id: str, habit_name: str, frequency: str, duration: str, date: str):
        """Save lifestyle habit"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (h:Habit {name: $habit_name})
                MERGE (u)-[r:HAS_HEALTH_HABIT]->(h)
                SET r.frequency = $frequency,
                    r.duration = $duration,
                    r.last_updated = $date
            """, patient_id=patient_id, habit_name=habit_name, frequency=frequency, duration=duration, date=date)

    def save_sleep(self, patient_id: str, hours: float, quality: str, date: str):
        """Save sleep record"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                CREATE (s:Sleep {
                    hours: $hours,
                    quality: $quality,
                    date: $date,
                    id: randomUUID()
                })
                CREATE (u)-[r:HAS_SLEEP_PATTERN]->(s)
            """, patient_id=patient_id, hours=hours, quality=quality, date=date)

    def save_diet(self, patient_id: str, diet_type: str, date: str):
        """Save diet pattern"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (d:Diet {type: $diet_type})
                MERGE (u)-[r:FOLLOWS_DIET]->(d)
                SET r.last_updated = $date
            """, patient_id=patient_id, diet_type=diet_type, date=date)

    def save_doctor_visit(self, patient_id: str, doctor_name: str, reason: str, date: str):
        """Save doctor visit"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                CREATE (d:Doctor {name: $doctor_name})
                CREATE (u)-[r:VISITED {reason: $reason, date: $date}]->(d)
            """, patient_id=patient_id, doctor_name=doctor_name, reason=reason, date=date)

    def save_hospitalization(self, patient_id: str, reason: str, date: str):
        """Save hospitalization"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                CREATE (h:Hospitalization {reason: $reason, date: $date, id: randomUUID()})
                CREATE (u)-[r:HOSPITALIZED_FOR]->(h)
            """, patient_id=patient_id, reason=reason, date=date)

    def save_lab_result(self, patient_id: str, test_name: str, value: str, unit: str, date: str):
        """Save lab result"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (l:LabTest {name: $test_name})
                CREATE (u)-[r:HAS_LAB_RESULT {value: $value, unit: $unit, date: $date}]->(l)
            """, patient_id=patient_id, test_name=test_name, value=value, unit=unit, date=date)

    def save_blood_group(self, patient_id: str, group_name: str):
        """Save blood group"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (b:BloodGroup {name: $group_name})
                MERGE (u)-[:HAS_BLOOD_GROUP]->(b)
            """, patient_id=patient_id, group_name=group_name)

    def save_emergency_contact(self, patient_id: str, contact_name: str, phone: str, relation: str):
        """Save emergency contact"""
        with self.driver.session() as session:
            session.run("""
                MERGE (u:User {id: $patient_id})
                MERGE (c:EmergencyContact {name: $contact_name, phone: $phone})
                MERGE (u)-[r:EMERGENCY_CONTACT]->(c)
                SET r.relation = $relation
            """, patient_id=patient_id, contact_name=contact_name, phone=phone, relation=relation)


    # --- Hackathon-Winning Query Analytics ---

    def get_family_disease_risk(self, patient_id: str) -> List[Dict]:
        """Which conditions occur most in the family network?"""
        with self.driver.session() as session:
            res = session.run("""
                MATCH (u:User {id: $patient_id})-[:FAMILY_MEMBER*1..2]-(member:User)-[:HAS_CONDITION]->(c:Condition)
                RETURN c.name as condition, count(distinct member) as occurrence_count, collect(member.name) as affected_family
                ORDER BY occurrence_count DESC
            """, patient_id=patient_id)
            return [dict(r) for r in res]

    def get_shared_medications(self, patient_id: str) -> List[Dict]:
        """Which medicines are commonly used in the family?"""
        with self.driver.session() as session:
            res = session.run("""
                MATCH (u:User {id: $patient_id})-[:FAMILY_MEMBER*1..2]-(member:User)-[:TAKES_MEDICATION]->(m:Medication)
                RETURN m.name as medication, count(distinct member) as user_count, collect(member.name) as users
                ORDER BY user_count DESC
            """, patient_id=patient_id)
            return [dict(r) for r in res]

    def get_symptom_trends(self, patient_id: str) -> List[Dict]:
        """Which symptoms are active/increasing in the family network?"""
        with self.driver.session() as session:
            res = session.run("""
                MATCH (u:User {id: $patient_id})-[:FAMILY_MEMBER*1..2]-(member:User)-[r:HAS_SYMPTOM]->(s:Symptom)
                RETURN s.name as symptom, count(r) as reports, avg(r.severity) as avg_severity
                ORDER BY reports DESC
            """, patient_id=patient_id)
            return [dict(r) for r in res]

    def get_habit_correlations(self, patient_id: str) -> List[Dict]:
        """Correlate sleep quality with symptom occurrence across the user base/family"""
        with self.driver.session() as session:
            res = session.run("""
                MATCH (u:User)-[:HAS_SLEEP_PATTERN]->(s:Sleep)
                WHERE s.quality IN ['poor', 'restless']
                MATCH (u)-[r:HAS_SYMPTOM]->(sym:Symptom)
                RETURN sym.name as symptom, count(distinct u) as affected_users, avg(r.severity) as avg_severity
                ORDER BY affected_users DESC
            """, patient_id=patient_id)
            return [dict(r) for r in res]

    def get_health_timeline(self, patient_id: str) -> List[Dict]:
        """Show full user health journey chronological log"""
        with self.driver.session() as session:
            res = session.run("""
                MATCH (u:User {id: $patient_id})-[r]->(n)
                WHERE r.date IS NOT NULL OR r.since IS NOT NULL OR r.started_date IS NOT NULL OR r.diagnosed_date IS NOT NULL
                RETURN coalesce(r.date, r.since, r.started_date, r.diagnosed_date) as event_date, 
                       type(r) as event_type, 
                       labels(n)[0] as node_type, 
                       properties(n) as details
                ORDER BY event_date DESC
            """, patient_id=patient_id)
            return [dict(r) for r in res]

neo4j_service = Neo4jHealthService()
