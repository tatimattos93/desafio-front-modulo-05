import React from 'react';
import InputMask from 'react-input-mask';

const somenteNumeros = (str) => str.replace(/\D/g, '');

export const InputCPF = ({ value, onChange, placeholder, onBlur, className }) => {

    function converteMaskemSomenteNumeros(event) {

        onChange({
            ...event,
            target: {
                ...event.target,
                value: event.target === '' ? '' : somenteNumeros(event.target.value)

            }

        }

        );
    }

    return <InputMask
        mask="999.999.999-99"
        value={value}
        onChange={converteMaskemSomenteNumeros}
        placeholder={placeholder}
        onBlur={onBlur}
        className={className}
    />;
}

export const InputTelefone = ({ value, onChange, placeholder, onBlur, className }) => {

    function converteMaskemSomenteNumeros(event) {

        onChange({
            ...event,
            target: {
                ...event.target,
                value: somenteNumeros(event.target.value)

            }

        }

        );
    }

    return <InputMask
        mask="(99) 9999-9999"
        value={value}
        onChange={converteMaskemSomenteNumeros}
        placeholder={placeholder}
        onBlur={onBlur}
        className={className}
    />;
}

export const InputCep = ({ value, onChange, placeholder, onBlur, className }) => {

    function converteMaskemSomenteNumeros(event) {

        onChange({
            ...event,
            target: {
                ...event.target,
                value: somenteNumeros(event.target.value)

            }

        }

        );
    }

    return <InputMask
        mask="99999-999"
        value={value}
        onChange={converteMaskemSomenteNumeros}
        placeholder={placeholder}
        onBlur={onBlur}
        className={className}
    />;
}



