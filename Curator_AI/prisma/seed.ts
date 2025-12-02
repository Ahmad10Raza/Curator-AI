import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const techStackData = {
    "AI_ML_DataScience": {
        "Programming_Languages": [
            "Python",
            "R",
            "Julia",
            "MATLAB",
            "Scala",
            "Java",
            "C++"
        ],
        "ML_Frameworks": [
            "TensorFlow",
            "PyTorch",
            "Keras",
            "Scikit-learn",
            "XGBoost",
            "LightGBM",
            "CatBoost"
        ],
        "Deep_Learning_Architectures": [
            "CNN",
            "RNN",
            "LSTM",
            "Transformer",
            "GANs",
            "Autoencoders"
        ],
        "NLP_Tools": [
            "NLTK",
            "SpaCy",
            "HuggingFace Transformers",
            "OpenAI API",
            "BERT",
            "GPT"
        ],
        "Data_Analysis_Visualization": [
            "NumPy",
            "Pandas",
            "Matplotlib",
            "Seaborn",
            "Plotly",
            "Power BI",
            "Tableau"
        ],
        "Big_Data": [
            "Hadoop",
            "Spark",
            "PySpark",
            "Hive",
            "Pig"
        ],
        "MLOps": [
            "MLflow",
            "Kubeflow",
            "DVC",
            "Airflow",
            "SageMaker",
            "Weights & Biases"
        ],
        "ML_Databases": [
            "MongoDB",
            "PostgreSQL",
            "MySQL",
            "ChromaDB",
            "Pinecone",
            "ElasticSearch"
        ]
    },

    "FullStack_Development": {
        "Frontend_Languages": ["HTML", "CSS", "JavaScript", "TypeScript"],
        "Frontend_Frameworks": [
            "React.js",
            "Next.js",
            "Angular",
            "Vue.js",
            "Svelte",
            "SolidJS"
        ],
        "CSS_Frameworks": [
            "TailwindCSS",
            "Bootstrap",
            "Material UI",
            "Chakra UI",
            "Bulma"
        ],
        "Backend_Languages_Frameworks": [
            "Node.js",
            "Express.js",
            "Python (Django)",
            "Python (Flask)",
            "FastAPI",
            "Java (Spring Boot)",
            "C# (.NET)",
            "PHP (Laravel)",
            "Ruby on Rails",
            "GoLang"
        ],
        "Databases": [
            "MySQL",
            "PostgreSQL",
            "MongoDB",
            "Redis",
            "Cassandra",
            "DynamoDB"
        ],
        "API_SystemDesign": [
            "REST API",
            "GraphQL",
            "WebSockets",
            "gRPC"
        ],
        "FullStack_Architectures": [
            "MERN",
            "MEAN",
            "LAMP"
        ]
    },

    "Mobile_Development": {
        "Android": ["Java", "Kotlin", "Android Studio", "Jetpack Compose"],
        "iOS": ["Swift", "SwiftUI", "Xcode"],
        "CrossPlatform": ["Flutter", "React Native", "Ionic", "Xamarin", "Kotlin Multiplatform"]
    },

    "Cloud_Computing": {
        "AWS": [
            "EC2",
            "S3",
            "Lambda",
            "DynamoDB",
            "RDS",
            "SageMaker"
        ],
        "Azure": [
            "Azure Functions",
            "Cognitive Services",
            "Azure SQL",
            "Azure ML Studio"
        ],
        "GCP": [
            "Firebase",
            "BigQuery",
            "App Engine",
            "Vertex AI"
        ]
    },

    "DevOps_Automation": {
        "CI_CD": ["GitHub Actions", "GitLab CI", "Jenkins", "CircleCI"],
        "Containers_Orchestration": ["Docker", "Kubernetes", "Helm", "OpenShift"],
        "Infrastructure_as_Code": ["Terraform", "CloudFormation", "Ansible", "Chef", "Puppet"],
        "Monitoring_Logging": ["Prometheus", "Grafana", "ELK Stack", "Datadog", "Splunk"]
    },

    "Cybersecurity": {
        "Security_Domains": [
            "Network Security",
            "Application Security",
            "Cloud Security",
            "Ethical Hacking"
        ],
        "Tools": [
            "Burp Suite",
            "Wireshark",
            "Metasploit",
            "Nmap",
            "Nessus",
            "OSINT Tools"
        ]
    },

    "Data_Engineering": {
        "ETL_Tools": ["Airflow", "Talend", "Informatica", "AWS Glue"],
        "Streaming_Pipelines": ["Kafka", "RabbitMQ", "Flink", "Storm"],
        "Data_Warehouses": ["Snowflake", "BigQuery", "Redshift", "Databricks"]
    },

    "RPA_Robotics_Automation": {
        "RPA_Tools": [
            "Automation Anywhere",
            "UiPath",
            "Blue Prism",
            "Power Automate",
            "Selenium"
        ],
        "Scripting_Languages": ["VBScript", "Python", "JavaScript"]
    },

    "Game_Development": {
        "Engines": ["Unity", "Unreal Engine", "Godot"],
        "Languages": ["C#", "C++"]
    },

    "AR_VR_Metaverse": {
        "Tools": [
            "Unity XR",
            "Unreal AR",
            "Blender",
            "Oculus SDK"
        ]
    },

    "IoT_Embedded": {
        "Hardware_Devices": ["Arduino", "Raspberry Pi", "ESP32"],
        "Software_Tools": ["MicroPython", "Zephyr OS"]
    },

    "Blockchain_Web3": {
        "Platforms": ["Ethereum", "Solana", "Polygon"],
        "Tools": ["Metamask", "Hardhat", "Truffle", "Ganache"]
    },

    "Software_Testing": {
        "Manual_Testing": ["Test Planning", "Test Cases"],
        "Automation_Testing": ["Selenium", "Playwright", "Cypress"],
        "Performance_Testing": ["JMeter", "LoadRunner"]
    },

    "UI_UX_Design": {
        "Tools": ["Figma", "Adobe XD", "Sketch", "Canva"]
    },

    // Note: "Databases" key was duplicated in user input (also inside FullStack). 
    // Merging generic Databases here if not already covered.
    "General_Databases": {
        "SQL": ["MySQL", "PostgreSQL", "Oracle", "SQL Server"],
        "NoSQL": ["MongoDB", "Cassandra", "CouchDB", "Firebase"]
    }
}

async function main() {
    console.log('Start seeding...')

    // Flatten the data structure
    const topicsToInsert: { name: string, category: string, description: string, difficulty: string }[] = []

    for (const [category, subcategories] of Object.entries(techStackData)) {
        // Clean up category name (e.g., "AI_ML_DataScience" -> "AI / ML / Data Science")
        const formattedCategory = category.replace(/_/g, ' ')

        for (const [subcategory, tools] of Object.entries(subcategories)) {
            // Clean up subcategory name
            const formattedSubcategory = subcategory.replace(/_/g, ' ')

            for (const toolName of tools) {
                topicsToInsert.push({
                    name: toolName,
                    category: formattedCategory,
                    description: `${toolName} is a tool/technology used in ${formattedSubcategory}.`,
                    difficulty: 'INTERMEDIATE', // Default difficulty
                })
            }
        }
    }

    console.log(`Prepared ${topicsToInsert.length} topics for insertion.`)

    for (const topic of topicsToInsert) {
        await prisma.techTopic.upsert({
            where: { name: topic.name },
            update: {
                category: topic.category,
                // We don't overwrite description if it exists, as user might have customized it. 
                // But for this seed, we can just update it or leave it. Let's update category.
            },
            create: topic,
        })
    }

    console.log('Seed data inserted!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
