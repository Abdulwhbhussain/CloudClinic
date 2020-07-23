import React, { useState } from 'react';
import '../Form/Form.scss';
import Button from '../../../Button/Button';
import AuthInput from '../Form/AuthInput/AuthInput';
import AuthSelect from '../Form/AuthSelect/AuthSelect';
import languages from '../Form/languages';

const StepThree = ({
  formState,
  onValueChange,
  handleAddClick,
  handleRemoveClick,
  onArrValueChange,
  handleLanguages,
  onInput,
}) => {
  const { isDoctor } = formState;
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const severityOptions = [1, 2, 3, 4, 5];
  const clientSignup = (
    <>
      <h3>Existing Conditions</h3>
      <p>
        Please list any current medical conditions and their approximate start
        date
      </p>

      {formState.existingConditions.map((val, i) => {
        return (
          <div key={i}>
            <AuthInput
              name="condition"
              value={val.condition}
              placeholder="Condition"
              type="text"
              maxLength="30"
              icon="condition"
              onValueChange={e =>
                onArrValueChange(e, 'existingConditions', i, 'condition')
              }
            />
            <AuthInput
              name="conditionStartDate"
              value={val.startDate}
              type="date"
              icon="calendar"
              placeholder="Start date"
              isDate
              max="2020-01-01"
              min="1900-01-01"
              onValueChange={e =>
                onArrValueChange(e, 'existingConditions', i, 'startDate')
              }
            />
            <AuthInput
              name="conditionComment"
              value={val.notes}
              placeholder="Comments"
              type="text"
              maxLength="100"
              icon="textArea"
              onValueChange={e =>
                onArrValueChange(e, 'existingConditions', i, 'notes')
              }
            />
            <div className="btn-box">
              {formState.existingConditions.length !== 1 && (
                <Button
                  onClick={() => handleRemoveClick('existingConditions', i)}
                  icon="minus"
                  color="mid"
                />
              )}
              {formState.existingConditions.length - 1 === i && (
                <Button
                  onClick={() =>
                    formState.existingConditions[i].condition !== '' &&
                    handleAddClick('existingConditions', {
                      condition: '',
                      startDate: '',
                      notes: '',
                    })
                  }
                  icon="plus"
                  color="mid"
                />
              )}
            </div>
          </div>
        );
      })}

      <h3>Allergies</h3>

      {formState.allergies.map((val, i) => {
        return (
          <div key={i}>
            <AuthInput
              name="allergy"
              value={val.name}
              placeholder="Allergy"
              type="text"
              maxLength="30"
              icon="alertCircle"
              onValueChange={e => onArrValueChange(e, 'allergies', i, 'name')}
            />

            <AuthSelect
              name="severity"
              value={val.severity}
              placeholder="Severity"
              type="text"
              icon="hash"
              directive="allergy"
              options={severityOptions}
              onValueChange={e =>
                onArrValueChange(e, 'allergies', i, 'severity')
              }
            />
            <div className="btn-box">
              {formState.allergies.length !== 1 && (
                <Button
                  onClick={() => handleRemoveClick('allergies', i)}
                  icon="minus"
                  color="mid"
                />
              )}
              {formState.allergies.length - 1 === i && (
                <Button
                  onClick={() =>
                    formState.allergies[i].name !== '' &&
                    handleAddClick('allergies', {
                      allergy: '',
                      severity: '',
                    })
                  }
                  icon="plus"
                  color="mid"
                />
              )}
            </div>
          </div>
        );
      })}

      <h3>Medication</h3>

      {formState.medication.map((val, i) => {
        return (
          <div key={i}>
            <AuthInput
              name="medication"
              value={val.name}
              placeholder="Medication"
              type="text"
              icon="medication"
              maxLength="30"
              onValueChange={e => onArrValueChange(e, 'medication', i, 'name')}
            />
            <AuthInput
              name="dosage"
              value={val.dosage}
              placeholder="Dosage (mg)"
              type="number"
              min="1"
              max="5000"
              maxLength="4"
              icon="hash"
              onValueChange={e =>
                onArrValueChange(e, 'medication', i, 'dosage')
              }
              onInput={onInput}
            />
            <AuthInput
              name="manufacturer"
              value={val.manufacturer}
              placeholder="Manufacturer"
              type="text"
              icon="briefcase"
              maxLength="30"
              onValueChange={e =>
                onArrValueChange(e, 'medication', i, 'manufacturer')
              }
            />
            <div className="btn-box">
              {formState.medication.length !== 1 && (
                <Button
                  onClick={() => handleRemoveClick('medication', i)}
                  icon="minus"
                  color="mid"
                />
              )}
              {formState.medication.length - 1 === i && (
                <Button
                  onClick={() =>
                    formState.medication[i].name !== '' &&
                    handleAddClick('medication', {
                      medication: '',
                      dosage: '',
                      manufacturer: '',
                    })
                  }
                  icon="plus"
                  color="mid"
                />
              )}
            </div>
          </div>
        );
      })}

      <h3>Blood Type</h3>
      <AuthSelect
        value={formState.bloodType}
        placeholder="Blood Type"
        icon="heart"
        directive="blood"
        options={bloodTypes}
        onValueChange={e => onValueChange(e, 'bloodType')}
      />
    </>
  );

  // const [accredInput, setAccredInput] = useState('');

  const doctorSignup = (
    <>
      <AuthInput
        value={formState.licence}
        placeholder="Licence"
        type="text"
        maxLength="30"
        icon="licence"
        onValueChange={e => onValueChange(e, 'licence')}
      />
      {formState.accreditations.map((val, i) => {
        return (
          <div key={i} className="auth-multi">
            <AuthInput
              name="accreditation"
              value={val.accreditation}
              placeholder="Accreditation"
              type="text"
              maxLength="30"
              icon="briefcase"
              onValueChange={e =>
                onArrValueChange(e, 'accreditations', i, 'accreditation')
              }
            />
            <div className="btn-box">
              {formState.accreditations.length !== 1 && (
                <Button
                  onClick={() => handleRemoveClick('accreditations', i)}
                  icon="minus"
                  color="mid"
                />
              )}
              {formState.accreditations.length - 1 === i && (
                <Button
                  onClick={() =>
                    formState.accreditations[i].accreditation !== '' &&
                    handleAddClick('accreditations', {
                      accreditation: '',
                    })
                  }
                  icon="plus"
                  color="mid"
                />
              )}
            </div>
          </div>
        );
      })}
      <AuthInput
        value={formState.specialtyField}
        placeholder="Specialty Field"
        type="text"
        maxLength="30"
        icon="fileText"
        onValueChange={e => onValueChange(e, 'specialtyField')}
      />
      <AuthInput
        value={formState.subSpecialtyField}
        placeholder="Sub Specialty Field"
        type="text"
        maxLength="30"
        icon="fileText"
        onValueChange={e => onValueChange(e, 'subSpecialtyField')}
      />
      {formState.educations.map((val, i) => {
        return (
          <div key={i} className="auth-multi">
            <AuthInput
              name="education"
              value={val.education}
              placeholder="Education"
              type="text"
              maxLength="30"
              icon="briefcase"
              onValueChange={e =>
                onArrValueChange(e, 'educations', i, 'education')
              }
            />
            <div className="btn-box">
              {formState.educations.length !== 1 && (
                <Button
                  onClick={() => handleRemoveClick('educations', i)}
                  icon="minus"
                  color="mid"
                />
              )}
              {formState.educations.length - 1 === i && (
                <Button
                  onClick={() =>
                    formState.educations[i].education !== '' &&
                    handleAddClick('educations', {
                      education: '',
                    })
                  }
                  icon="plus"
                  color="mid"
                />
              )}
            </div>
          </div>
        );
      })}
      <AuthInput
        value={formState.yearsExp}
        placeholder="Years of Experience"
        type="number"
        icon="hash"
        maxLength="2"
        onValueChange={e => onValueChange(e, 'yearsExp')}
        onInput={onInput}
      />
      {formState.languages.map((val, i) => {
        console.log(val);
        return (
          <div key={i} className="auth-multi">
            <AuthSelect
              value={formState.languages[i]}
              placeholder="Language"
              type="text"
              directive="language"
              icon="language"
              options={languages}
              onValueChange={e => handleLanguages(e, i)}
            />
            <div className="btn-box">
              {formState.languages.length !== 1 && (
                <Button
                  onClick={() => handleRemoveClick('languages', i)}
                  icon="minus"
                  color="mid"
                />
              )}
              {formState.languages.length - 1 === i && (
                <Button
                  onClick={() =>
                    formState.languages[i] !== '' &&
                    handleAddClick('languages', {
                      language: '',
                    })
                  }
                  icon="plus"
                  color="mid"
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );

  return <div>{isDoctor ? doctorSignup : clientSignup}</div>;
};

export default StepThree;