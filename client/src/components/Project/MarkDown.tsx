import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const MarkDown = (props: { value: string }) => {
  return (
    <ReactMarkdown
      children={props.value}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ ...props }) => (
          <>
            <h2 {...props} />
            <hr />
          </>
        ),
        h2: ({ ...props }) => (
          <>
            <h3 {...props} />
            <hr />
          </>
        ),
        h3: 'h4',
        h4: 'h5',
        h5: 'h6',
        pre: ({ ...props }) => (
          <>
            <pre
              {...props}
              style={{
                backgroundColor: '#61616129',
                padding: '15px',
                borderRadius: '10px',
              }}
            />
          </>
        ),
        code: ({ children, ...props }) => (
          <>
            <code children={children} {...props} />
            <CopyToClipboard text={children.toString()}>
              <div className='copy'>
                <FontAwesomeIcon icon={faCopy} />
              </div>
            </CopyToClipboard>
          </>
        ),
      }}
    />
  );
};

export default MarkDown;
