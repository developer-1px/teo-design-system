
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as styles from './ApiDocsLayout.css.ts';
import { prose } from '../../../styles/prose.css';

const REQUEST_BODY_MD = `
### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| **username** | \`string\` | Unique identifier for the user. |
| **email** | \`string\` | Valid email address. |
| **role** | \`enum\` | One of: \`admin\`, \`editor\`, \`viewer\`. |
`;

const RESPONSES_MD = `
### Responses

User created successfully. Returns the created user object with generated ID.
`;

export const ContextPanel = () => {
    return (
        <div className={styles.contextContainer}>
            <div className={styles.docHeader}>
                <h1 className={styles.docTitle}>Create User</h1>
                <p className={styles.docDescription}>
                    Creates a new user in the system. This endpoint requires admin privileges.
                </p>
            </div>

            <div className={styles.docSection}>
                <div className={prose}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {REQUEST_BODY_MD}
                    </ReactMarkdown>
                </div>
            </div>

            <div className={styles.docSection}>
                {/* Custom UI elements can be mixed with Markdown if needed, or fully Markdown */}
                {/* Preserving custom Tab UI for responses as it might be interactive later, 
                     but using Markdown for the text content below it */}

                <h3 className={styles.sectionTitle}>Responses</h3>
                <div className={styles.responseSchema}>
                    <div className={styles.responseTab} data-active="true">200</div>
                    <div className={styles.responseTab}>400</div>
                    <div className={styles.responseTab}>403</div>
                </div>

                <div className={styles.schemaExample}>
                    <div className={prose}>
                        <ReactMarkdown>
                            {RESPONSES_MD.replace('### Responses', '')}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};
