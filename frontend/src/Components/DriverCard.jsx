import React from 'react'
import classNames from 'classnames'
import { FaCheckCircle } from 'react-icons/fa'
const DriverCard = ({ driver, isSelected, isDisabled, onClick }) => {

    return (
        <div
            className={classNames("driver-item card border-0 shadow-sm", {
                'selected border-success': isSelected,
                'disabled opacity-50': isDisabled
            })}
            onClick={!isDisabled ? onClick : undefined}
            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
        >
            {}
            <div className="card-body text-center">
                <h6 className="mb-1">{driver.name}</h6>
                <p className="text-muted small mb-0">{driver.team}</p>
                {isSelected && <FaCheckCircle className="text-success mt-2" />}
            </div>
        </div>
    )
}
export default DriverCard