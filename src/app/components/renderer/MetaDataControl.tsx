import { withJsonFormsControlProps } from '@jsonforms/react';

interface MetaDataControlProps {
  data: MetaDataValue;
  handleChange(path: string, value: MetaDataValue): void;
  path: string;
}

interface MetaDataValue {
  trailingSlashMode: TrailingSlashMode;
  redirectSlashes: RedirectSlashes;
  caseSensitive: boolean;
  entityValueCase: EntityCase;
  optionsPassthrough: boolean;
}

interface MetaDataProps {
  id?: string;
  value: MetaDataValue;
  updateValue: (newValue: MetaDataValue) => void;
}

type EntityCase = 'none' | 'lowercase' | 'uppercase';
type RedirectSlashes = 'ignore' | 'strip' | 'append' | '';
type TrailingSlashMode = 'strict' | 'fallback';

const MetaDataControl = ({
  data,
  handleChange,
  path,
}: MetaDataControlProps) => {
  return (
    <MetaData
      value={data}
      updateValue={(newValue: MetaDataValue) => handleChange(path, newValue)}
    />
  );
};

export default withJsonFormsControlProps(MetaDataControl);

function MetaData({ id, value, updateValue }: MetaDataProps) {
  return (
    <div>
      <div>
        <label>Trailing Slash Mode:</label>
        <select
          value={value.trailingSlashMode || ''}
          onChange={e =>
            updateValue({
              ...value,
              trailingSlashMode: e.target.value as TrailingSlashMode,
            })
          }>
          <option value="strict">Strict</option>
          <option value="fallback">Fallback</option>
        </select>
      </div>

      <div>
        <label>Redirect Slashes:</label>
        <select
          value={value.redirectSlashes || ''}
          onChange={e =>
            updateValue({
              ...value,
              redirectSlashes: e.target.value as RedirectSlashes,
            })
          }>
          <option value=""></option>
          <option value="ignore">Ignore</option>
          <option value="strip">Strip</option>
          <option value="append">Append</option>
        </select>
      </div>

      <div>
        <label>Case Sensitive:</label>
        <input
          type="checkbox"
          checked={value.caseSensitive ?? false}
          onChange={e =>
            updateValue({ ...value, caseSensitive: e.target.checked })
          }
        />
      </div>

      <div>
        <label>Entity Case Value:</label>
        <select
          value={value.entityValueCase || ''}
          onChange={e =>
            updateValue({
              ...value,
              entityValueCase: e.target.value as EntityCase,
            })
          }>
          <option value="none">None</option>
          <option value="lowercase">Lowercase</option>
          <option value="uppercase">Uppercase</option>
        </select>
      </div>

      <div>
        <label>Options Passthrough:</label>
        <input
          type="checkbox"
          checked={value.optionsPassthrough ?? false}
          onChange={e =>
            updateValue({ ...value, optionsPassthrough: e.target.checked })
          }
        />
      </div>
    </div>
  );
}
