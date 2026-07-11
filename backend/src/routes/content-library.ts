type ContentEntry = { text: string; title: string };
type ContentMap = Record<string, ContentEntry[]>;

const CODING: ContentMap = {
  python: [
    {
      title: "Binary Search",
      text: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

def main():
    sorted_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    target = 7
    result = binary_search(sorted_array, target)
    if result != -1:
        print(f"Element {target} found at index {result}")
    else:
        print(f"Element {target} not found in array")

if __name__ == "__main__":
    main()`,
    },
    {
      title: "Fibonacci with Memoization",
      text: `from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def fibonacci_sequence(count):
    return [fibonacci(i) for i in range(count)]

class FibonacciGenerator:
    def __init__(self):
        self.cache = {0: 0, 1: 1}

    def compute(self, n):
        if n not in self.cache:
            self.cache[n] = self.compute(n - 1) + self.compute(n - 2)
        return self.cache[n]

if __name__ == "__main__":
    gen = FibonacciGenerator()
    for i in range(10):
        print(f"F({i}) = {gen.compute(i)}")`,
    },
    {
      title: "Linked List",
      text: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    def delete(self, data):
        if not self.head:
            return
        if self.head.data == data:
            self.head = self.head.next
            return
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next

    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        return " -> ".join(elements)`,
    },
  ],
  java: [
    {
      title: "Stack Implementation",
      text: `import java.util.ArrayList;
import java.util.EmptyStackException;

public class Stack<T> {
    private ArrayList<T> elements = new ArrayList<>();

    public void push(T item) {
        elements.add(item);
    }

    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return elements.remove(elements.size() - 1);
    }

    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return elements.get(elements.size() - 1);
    }

    public boolean isEmpty() {
        return elements.isEmpty();
    }

    public int size() {
        return elements.size();
    }

    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(10);
        stack.push(20);
        stack.push(30);
        System.out.println("Top: " + stack.peek());
        System.out.println("Popped: " + stack.pop());
        System.out.println("Size: " + stack.size());
    }
}`,
    },
    {
      title: "Bubble Sort",
      text: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
    }

    public static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int[] data = {64, 34, 25, 12, 22, 11, 90};
        System.out.print("Before sorting: ");
        printArray(data);
        bubbleSort(data);
        System.out.print("After sorting: ");
        printArray(data);
    }
}`,
    },
  ],
  javascript: [
    {
      title: "Promise Chain",
      text: `const fetchUser = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "Alice", role: "developer" });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 100);
  });
};

const fetchUserPosts = (user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Getting Started with JS", author: user.name },
        { id: 2, title: "Advanced Promises", author: user.name },
      ]);
    }, 100);
  });
};

async function getUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchUserPosts(user);
    return { user, posts };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}

getUserData(1).then(({ user, posts }) => {
  console.log("User:", user.name);
  console.log("Posts:", posts.length);
});`,
    },
  ],
  cpp: [
    {
      title: "Merge Sort",
      text: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6, 7};
    mergeSort(arr, 0, arr.size() - 1);
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
    },
  ],
  c: [
    {
      title: "String Reverse",
      text: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void reverseString(char* str) {
    int length = strlen(str);
    int start = 0;
    int end = length - 1;
    while (start < end) {
        char temp = str[start];
        str[start] = str[end];
        str[end] = temp;
        start++;
        end--;
    }
}

int isPalindrome(const char* str) {
    int length = strlen(str);
    for (int i = 0; i < length / 2; i++) {
        if (str[i] != str[length - 1 - i]) {
            return 0;
        }
    }
    return 1;
}

int main() {
    char word[] = "programming";
    printf("Original: %s\n", word);
    reverseString(word);
    printf("Reversed: %s\n", word);
    char test[] = "racecar";
    printf("Is '%s' a palindrome? %s\n", test, isPalindrome(test) ? "Yes" : "No");
    return 0;
}`,
    },
  ],
  mysql: [
    {
      title: "Employee Queries",
      text: `CREATE TABLE employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees(emp_id)
);

INSERT INTO employees (first_name, last_name, department, salary, hire_date)
VALUES ('Alice', 'Johnson', 'Engineering', 95000.00, '2020-03-15'),
       ('Bob', 'Smith', 'Marketing', 72000.00, '2019-07-22'),
       ('Carol', 'Williams', 'Engineering', 88000.00, '2021-01-10');

SELECT department, COUNT(*) AS headcount,
       AVG(salary) AS avg_salary,
       MAX(salary) AS max_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;

SELECT e.first_name, e.last_name, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(salary) FROM employees)
ORDER BY e.salary DESC;`,
    },
  ],
  html: [
    {
      title: "Responsive Card",
      text: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Card</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <img src="avatar.jpg" alt="Profile Photo" class="avatar">
                <div class="badge">Pro</div>
            </div>
            <div class="card-body">
                <h2 class="name">Alice Johnson</h2>
                <p class="title">Senior Software Engineer</p>
                <p class="bio">Passionate about building scalable systems and mentoring junior developers.</p>
                <div class="stats">
                    <div class="stat">
                        <span class="value">128</span>
                        <span class="label">Projects</span>
                    </div>
                    <div class="stat">
                        <span class="value">4.9</span>
                        <span class="label">Rating</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary">Follow</button>
                <button class="btn btn-secondary">Message</button>
            </div>
        </div>
    </div>
</body>
</html>`,
    },
  ],
  css: [
    {
      title: "Dark Theme Variables",
      text: `:root {
    --color-background: #0a0a0a;
    --color-surface: #141414;
    --color-primary: #39ff6a;
    --color-secondary: #00d4ff;
    --color-text: #e8e8e8;
    --color-muted: #6b6b6b;
    --color-border: #2a2a2a;
    --font-mono: 'JetBrains Mono', monospace;
    --font-sans: 'Inter', sans-serif;
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --shadow-glow: 0 0 20px rgba(57, 255, 106, 0.15);
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-sans);
    line-height: 1.6;
    min-height: 100vh;
}

.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    transition: border-color var(--transition-normal);
}

.card:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
}`,
    },
  ],
};

const ENGLISH: ContentEntry[] = [
  {
    title: "The Art of Focus",
    text: `In the age of constant notifications and digital distractions, the ability to focus deeply on a single task has become one of the rarest and most valuable skills a person can develop. Researchers call this state of deep work — a condition in which your mind is fully immersed in a cognitively demanding task, free from interruption.

The science behind focus is compelling. When we concentrate without distraction, we enter a flow state where productivity and creativity reach their peak. Ideas connect in unexpected ways, problems that seemed insurmountable dissolve, and the quality of our output rises sharply.

Building this skill requires deliberate practice. Start with short focused sessions of twenty-five minutes, then gradually extend them. Remove your phone from sight, close unnecessary browser tabs, and signal to others that you are unavailable. Over weeks and months, your capacity for sustained attention will grow, and with it your ability to do work that truly matters.`,
  },
  {
    title: "Clean Code Principles",
    text: `Writing clean code is not just a matter of style — it is a form of professional respect for the people who will read and maintain your work, including your future self. The principles of clean code have been refined over decades of software engineering practice.

Names should reveal intent. A variable called userAccountBalance communicates far more than x or temp. Functions should do one thing and do it well, avoiding the temptation to pack multiple responsibilities into a single routine. Comments should explain why, not what — the code itself should be expressive enough to convey the how.

Consistency matters enormously. Choose a formatting style and apply it uniformly. Use the same patterns for error handling, the same conventions for naming test cases, and the same structure for organizing modules. When a codebase feels coherent, new contributors can navigate it confidently and changes carry lower risk.`,
  },
  {
    title: "The Power of Typing Speed",
    text: `Typing speed is one of those skills that pays dividends silently throughout a career. When you can type quickly and accurately, the gap between thought and expression narrows. Ideas flow from mind to screen without the friction of hunting for keys or correcting frequent errors.

For developers, fast typing compounds in value. Every search query, every terminal command, every code review comment benefits from the fluid translation of thought into text. Studies suggest that professional programmers who type faster are not necessarily better engineers, but they do spend less cognitive energy on the mechanical act of writing, leaving more capacity for the creative and analytical challenges that define great software.

The path to faster typing runs through deliberate, consistent practice. Short daily sessions focused on accuracy first, then speed, produce better results than occasional marathon drills. Measure your progress, identify your weak spots, and target them directly.`,
  },
];

const HINDI: ContentEntry[] = [
  {
    title: "भारत की संस्कृति",
    text: `भारत एक विविधताओं से भरा देश है। यहाँ अनेक भाषाएँ, धर्म और संस्कृतियाँ एक साथ फलती-फूलती हैं। भारतीय संस्कृति हजारों वर्षों पुरानी है और इसने विश्व को अनेक महान विचारक, वैज्ञानिक और कलाकार दिए हैं।

हमारे देश में त्योहारों का विशेष महत्व है। दीपावली, होली, ईद, क्रिसमस और बैसाखी जैसे पर्व मिलकर मनाए जाते हैं। यही हमारी एकता और सामाजिक सद्भाव की पहचान है।

भारतीय खानपान भी अपनी विविधता के लिए प्रसिद्ध है। उत्तर से दक्षिण और पूर्व से पश्चिम तक, हर क्षेत्र का अपना अनोखा स्वाद और पाककला है। यह विविधता ही भारत की असली शक्ति है।`,
  },
  {
    title: "तकनीक का युग",
    text: `आज का युग तकनीक का युग है। कंप्यूटर, स्मार्टफोन और इंटरनेट ने हमारे जीवन को पूरी तरह बदल दिया है। सूचना अब हमारी उंगलियों की नोक पर है।

कृत्रिम बुद्धिमत्ता यानी आर्टिफिशियल इंटेलिजेंस आज हर क्षेत्र में अपनी छाप छोड़ रही है। चिकित्सा, शिक्षा, कृषि और उद्योग — सभी में तकनीक ने क्रांति ला दी है।

युवाओं को चाहिए कि वे तकनीकी कौशल सीखें और डिजिटल भारत के निर्माण में योगदान दें। प्रोग्रामिंग, डेटा विज्ञान और साइबर सुरक्षा जैसे क्षेत्रों में रोजगार की अपार संभावनाएं हैं।`,
  },
];

const PLACEMENT: Record<string, ContentEntry> = {
  oops: {
    title: "OOP Concepts",
    text: `Object-Oriented Programming is a programming paradigm that organizes code around objects rather than functions and logic. The four core pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.

Encapsulation is the bundling of data and methods that operate on that data within a single unit, restricting direct access to some of the object's components. This prevents accidental modification of data and hides implementation details from the outside world.

Abstraction hides complex implementation details and shows only the necessary features of an object. Abstract classes and interfaces are the primary tools for achieving abstraction in languages like Java and C++.

Inheritance allows a class to acquire the properties and methods of another class. The class that inherits is called a child or subclass, and the class being inherited from is the parent or superclass. This promotes code reusability and establishes an is-a relationship.

Polymorphism allows objects of different classes to be treated as objects of a common superclass. Method overriding enables runtime polymorphism, while method overloading provides compile-time polymorphism. The same interface can represent different underlying forms of data.`,
  },
  dbms: {
    title: "Database Management",
    text: `A Database Management System is software that interacts with end users, applications, and the database itself to capture and analyze data. The primary goal of a DBMS is to provide efficient, convenient, and safe storage and retrieval of massive amounts of information.

Normalization is the process of organizing a relational database to reduce data redundancy and improve data integrity. First Normal Form requires that each column contain atomic values with no repeating groups. Second Normal Form eliminates partial dependencies on a composite primary key. Third Normal Form removes transitive dependencies.

ACID properties ensure reliable transaction processing. Atomicity guarantees that each transaction is treated as a single unit that either succeeds completely or fails completely. Consistency ensures that a transaction brings the database from one valid state to another. Isolation ensures that transactions execute independently without interference. Durability guarantees that committed transactions survive system failures permanently.

Indexing significantly improves query performance by creating a separate data structure that provides fast access to rows. B-tree indexes are the most common type and work well for range queries and exact matches.`,
  },
  operating_systems: {
    title: "Operating Systems",
    text: `An Operating System is system software that manages computer hardware, software resources, and provides services for computer programs. It acts as an intermediary between users and the computer hardware.

Process scheduling determines which process gets the CPU and for how long. First Come First Served is the simplest scheduling algorithm but can lead to the convoy effect. Shortest Job First minimizes average waiting time but requires knowledge of burst time in advance. Round Robin scheduling assigns a fixed time slice to each process in a circular order, providing good response time for interactive systems.

Memory management is responsible for allocating and deallocating memory to processes. Virtual memory allows execution of processes that may not be completely in memory by using disk space as an extension of RAM. Paging divides memory into fixed-size pages, while segmentation divides it into variable-size segments based on logical units.

Deadlock occurs when a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process. The necessary conditions for deadlock are mutual exclusion, hold and wait, no preemption, and circular wait.`,
  },
  computer_networks: {
    title: "Computer Networks",
    text: `Computer networks enable communication and resource sharing between devices. The OSI model divides network communication into seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.

The TCP/IP protocol suite is the foundation of the internet. TCP provides reliable, ordered, and error-checked delivery of a stream of bytes between applications. The three-way handshake establishes a connection: SYN, SYN-ACK, ACK. UDP provides a connectionless communication model with minimal overhead, suited for real-time applications.

IP addressing identifies devices on a network. IPv4 uses 32-bit addresses providing approximately 4.3 billion unique addresses. IPv6 uses 128-bit addresses providing an astronomically larger address space. Subnetting divides a network into smaller sub-networks for better organization and security.

DNS translates human-readable domain names into IP addresses. HTTP and HTTPS are the protocols used for transferring web pages. HTTPS adds a layer of security using TLS encryption to protect data in transit between the browser and server.`,
  },
  sql: {
    title: "SQL Interview Questions",
    text: `Structured Query Language is the standard language for relational database management systems. The main categories of SQL commands are DDL, DML, DCL, and TCL.

A JOIN combines rows from two or more tables based on a related column. INNER JOIN returns rows that have matching values in both tables. LEFT JOIN returns all rows from the left table and matching rows from the right table, with NULL for non-matching rows. RIGHT JOIN is the opposite. FULL OUTER JOIN returns rows when there is a match in either table.

Indexes are database objects that speed up data retrieval. A clustered index determines the physical order of data in a table, and there can be only one per table. A non-clustered index creates a separate structure with pointers to the data rows, and multiple non-clustered indexes can exist per table.

Stored procedures are precompiled SQL statements stored in the database. They improve performance by reducing parsing and compilation overhead, enhance security by controlling access to underlying tables, and promote code reusability. Triggers are special stored procedures that automatically execute in response to specific database events such as INSERT, UPDATE, or DELETE.`,
  },
};

const GOVERNMENT: Record<string, ContentEntry> = {
  ssc: {
    title: "SSC Passage",
    text: `India's ancient civilization, dating back over five thousand years, has bequeathed to the world an extraordinary heritage of knowledge, culture, and spiritual thought. The Indus Valley Civilization, contemporaneous with ancient Egypt and Mesopotamia, demonstrates the sophisticated urban planning and administrative capabilities of early Indian society.

The contributions of ancient Indian scholars to mathematics, astronomy, medicine, and philosophy have profoundly influenced the development of human knowledge. The concept of zero, the decimal number system, and the calculation of the value of pi are among the mathematical achievements that originated in ancient India.

The diversity of India's linguistic landscape is remarkable. The country recognizes twenty-two official languages in the Eighth Schedule of the Constitution, with Hindi and English serving as the official languages of the Union. This linguistic plurality reflects the rich cultural mosaic that defines the Indian subcontinent and its people across the ages.`,
  },
  banking: {
    title: "Banking Passage",
    text: `The banking sector serves as the backbone of a modern economy, facilitating the flow of capital from savers to borrowers and enabling investment in productive activities. Commercial banks accept deposits from the public and extend credit to individuals, businesses, and governments, thereby performing a critical intermediation function.

The Reserve Bank of India, established in 1935, functions as the central bank of the country. It formulates and implements monetary policy to maintain price stability while keeping in mind the objective of growth. The RBI also regulates and supervises the financial system, manages foreign exchange, and issues currency notes.

Non-Performing Assets represent loans where the borrower has defaulted on repayments for a period exceeding ninety days. High NPA levels reduce the profitability of banks, constrain their ability to lend, and require provisioning that depletes capital. Reducing NPAs has been a key priority for the Indian banking sector in recent years.`,
  },
  railway: {
    title: "Railway Passage",
    text: `Indian Railways is one of the world's largest railway networks, spanning over 67,000 route kilometers and serving as the principal mode of long-distance transportation for millions of Indians every day. Established in 1853 with the inauguration of the first passenger train between Bombay and Thane, it has grown into an organization of immense complexity and scale.

The railway network connects the remotest corners of the country, fostering national integration and providing affordable mobility to people of all economic backgrounds. It is also a significant freight carrier, transporting coal, steel, cement, foodgrains, and manufactured goods across the country.

The government has undertaken ambitious modernization initiatives in recent years, including the introduction of Vande Bharat Express trains, the electrification of rail lines, the development of dedicated freight corridors, and the upgrading of station infrastructure. These efforts aim to enhance speed, safety, and passenger comfort across the network.`,
  },
  clerk: {
    title: "Clerk Exam Passage",
    text: `Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, and investing. It encompasses the knowledge and skills required to make informed decisions about earning, spending, saving, and investing money.

Budget preparation is a fundamental aspect of personal and institutional financial management. A budget allocates anticipated income to various categories of expenditure, ensuring that spending does not exceed earnings and that sufficient resources are set aside for savings and contingencies.

Insurance provides financial protection against unforeseen losses and risks. Life insurance safeguards the financial security of dependents in the event of the policyholder's death. Health insurance covers medical expenses arising from illness or injury. Property insurance protects against losses resulting from fire, theft, or natural calamities. Understanding insurance products and their terms and conditions is essential for making appropriate coverage decisions.`,
  },
  stenographer: {
    title: "Stenographer Passage",
    text: `Administrative efficiency is fundamental to the effective functioning of government institutions and corporate organizations. The role of administrative and secretarial staff in maintaining records, managing correspondence, facilitating communication, and supporting decision-making processes cannot be overstated.

Stenography, the art of writing in shorthand, has been an essential skill for administrative professionals for over a century. It enables the rapid recording of spoken words at speeds that would be impossible with conventional longhand writing. Modern stenographers combine this traditional skill with proficiency in word processing, database management, and digital communication tools.

Official correspondence must adhere to established conventions of language, format, and protocol. Letters, memoranda, and reports should be drafted in clear and precise language, organized logically, and formatted according to the standards prescribed by the relevant authority. Accuracy, confidentiality, and timeliness are the hallmarks of professional administrative communication.`,
  },
};

const RESUME: Record<string, ContentEntry> = {
  bullet: {
    title: "Software Engineer Resume Bullets",
    text: `Led development of microservices architecture serving 2 million daily active users with 99.97% uptime, reducing infrastructure costs by 35% through efficient resource utilization.

Designed and implemented a real-time data pipeline using Apache Kafka and Spark Streaming, processing 500,000 events per second with sub-100ms latency for fraud detection.

Mentored a team of 6 junior engineers through weekly code reviews, pair programming sessions, and technical workshops, resulting in 40% improvement in code quality metrics.

Migrated legacy monolithic application to containerized microservices on Kubernetes, reducing deployment time from 4 hours to 12 minutes and enabling zero-downtime releases.

Built RESTful APIs consumed by 15 external partner integrations, with comprehensive documentation, versioning strategy, and backward compatibility maintained across 3 major versions.

Optimized database queries and introduced connection pooling, reducing average API response time from 800ms to 95ms and cutting database server load by 60%.`,
  },
  email: {
    title: "Professional Email",
    text: `Subject: Follow-Up on Project Proposal — Q3 Digital Transformation Initiative

Dear Ms. Sharma,

I hope this message finds you well. I am writing to follow up on the project proposal I submitted on Monday regarding the Q3 Digital Transformation Initiative. I wanted to ensure that you had the opportunity to review the document and address any questions that may have arisen.

As outlined in the proposal, we anticipate that the implementation of the automated reporting system will reduce manual data entry by approximately seventy percent and generate quarterly savings of around twelve lakh rupees. The phased rollout plan ensures minimal disruption to current operations.

I would welcome the opportunity to present the proposal in greater detail at your convenience. Please let me know if you would like to schedule a meeting at a time that suits your calendar. I am available any afternoon this week or next.

Thank you for your time and consideration. I look forward to hearing from you.

Warm regards,
Rahul Verma
Senior Business Analyst`,
  },
};

const BLIND: ContentEntry[] = [
  {
    title: "Memory Challenge",
    text: `The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly at dawn.`,
  },
  {
    title: "Programming Quote",
    text: `First, solve the problem. Then, write the code. Any fool can write code that a computer can understand. Good programmers write code that humans can understand. Clean code always looks like it was written by someone who cares.`,
  },
];

export function getLocalContent(mode: string, language: string): ContentEntry | null {
  if (mode === "coding") {
    const entries = CODING[language];
    if (entries && entries.length > 0) {
      return entries[Math.floor(Math.random() * entries.length)];
    }
    return null;
  }
  if (mode === "english" || mode === "hindi_english") {
    return ENGLISH[Math.floor(Math.random() * ENGLISH.length)];
  }
  if (mode === "hindi") {
    return HINDI[Math.floor(Math.random() * HINDI.length)];
  }
  if (mode === "placement") {
    return PLACEMENT[language] ?? PLACEMENT["oops"];
  }
  if (mode === "government") {
    return GOVERNMENT[language] ?? GOVERNMENT["ssc"];
  }
  if (mode === "resume") {
    return RESUME[language] ?? RESUME["bullet"];
  }
  if (mode === "blind") {
    return BLIND[Math.floor(Math.random() * BLIND.length)];
  }
  return ENGLISH[Math.floor(Math.random() * ENGLISH.length)];
}
