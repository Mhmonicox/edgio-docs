import React, {useEffect} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import styled from 'styled-components';

import getDescriptiveLanguage from '../getLanguage';

import CodeBlock from './CodeBlock';

export const StyledCustomPre = styled.div`
  border: 2px solid #363636;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 7px;

  .code-block__inner {
    display: flex;
    flex-direction: column;
    border-color: #356369;
    background: #242424;
  }

  .code-block__header {
    border-bottom: 2px solid #363636;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    padding: 6px 6px 6px 8px;
    font-size: 14px;
    color: white;
    display: flex;
    justify-content: space-between;

    [class*='header-'] {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .code-block__filename {
      background-color: #363636;
      border-radius: 4px;
      border: 1px solid #1a1a1a;
    }
  }

  .code-block__header-text {
    font-weight: 700;
  }

  code {
    --scrollbar-bg: #777;
  }
`;

export default function CustomPre({children}: {children: React.ReactNode}) {
  let message: string = '';
  const unknownLanguageString = 'language-unknown';
  let language: string = unknownLanguageString;
  let filename: string | undefined;

  if (typeof children === 'string') {
    message = children;
  } else if (
    React.isValidElement(children) &&
    typeof children.props.children === 'string'
  ) {
    message = children.props.children;
    language = children.props.className || unknownLanguageString;
    filename = children.props.filename;
  }

  // MDX Metadata...https://mdxjs.com/guides/syntax-highlighting/#syntax-highlighting-with-the-meta-field
  const replacedFilename = filename ? filename.replace(/"/g, '') : '';

  return (
    <StyledCustomPre>
      <div className="code-block line-numbers">
        <div className="code-block__inner">
          {language !== unknownLanguageString ? (
            <header className="code-block__header">
              <div className="header-start">
                <span className="code-block__header-text">
                  {getDescriptiveLanguage(language)}
                </span>
                {replacedFilename && (
                  <span className="code-block__filename">
                    {replacedFilename}
                  </span>
                )}
              </div>
              <div className="header-end">
                <CopyCode {...{message}} />
              </div>
            </header>
          ) : null}

          <main className="code-block__content">
            <CodeBlock language={language}>{message}</CodeBlock>
          </main>
        </div>
      </div>
    </StyledCustomPre>
  );
}

const StyledCopyCodeButton = styled.button`
  color: var(--white);
  background-color: #363636;
  font-weight: 600;
  border-radius: 4px;
  font-size: 14px;
  line-height: 19px;
  border: 1px solid #1a1a1a;
  cursor: pointer;
  padding: 4px 8px;
  transition: scale 0.2s ease-in-out;

  :hover {
    transform: scale(1.05);
  }
`;

function CopyCode({message}: {message: string}) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  });

  return (
    <CopyToClipboard text={message.trim()} onCopy={() => setCopied(true)}>
      <StyledCopyCodeButton className="code-block__copy">
        {copied ? 'Copied' : 'Copy'}
      </StyledCopyCodeButton>
    </CopyToClipboard>
  );
}
